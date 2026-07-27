package com.sisyphus.backend.auth.service;

import com.sisyphus.backend.auth.dto.LoginRequest;
import com.sisyphus.backend.auth.dto.RegisterRequest;
import com.sisyphus.backend.auth.dto.ExtensionTokenExchangeRequest;
import com.sisyphus.backend.auth.token.ExtensionAuthorizationCodeService;
import com.sisyphus.backend.auth.token.RefreshTokenService;
import com.sisyphus.backend.auth.dto.TokenWithRefresh;
import com.sisyphus.backend.security.jwt.JwtTokenProvider;
import com.sisyphus.backend.global.exception.UnauthorizedException;
import com.sisyphus.backend.user.dto.AccountUserSnapshot;
import com.sisyphus.backend.user.entity.Account;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.exception.UserNotFoundException;
import com.sisyphus.backend.user.repository.AccountRepository;
import com.sisyphus.backend.user.repository.UserRepository;
import com.sisyphus.backend.user.service.AccountService;
import com.sisyphus.backend.user.util.Provider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// 로그인/회원가입 로직과 JWT 발급 처리
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final AccountRepository accountRepository;
    private final AccountService accountService;
    private final ExtensionAuthorizationCodeService extensionAuthorizationCodeService;

    @Transactional
    public TokenWithRefresh signup(RegisterRequest request) {
        AccountUserSnapshot user = accountService.saveOrGetLocalAccount(
                request.getEmail(),
                request.getName(),
                request.getPassword()
        );
        return issueSession(user.id(), user.email(), user.role().name());
    }

    @Transactional(readOnly = true)
    public TokenWithRefresh login(LoginRequest request) {
        User user = authenticate(request);
        return issueSession(user.getId(), user.getEmail(), user.getRole().name());
    }

    @Transactional(readOnly = true)
    public String loginExtension(LoginRequest request) {
        User user = authenticate(request);
        return jwtTokenProvider.createAccessToken(
                user.getId(),
                user.getEmail(),
                List.of(user.getRole().name())
        );
    }

    private User authenticate(LoginRequest request) {
        Account account = accountRepository.findByEmailAndProviderFetchUser(
                        request.getEmail(), request.getProvider())
                .orElseThrow(() -> new UnauthorizedException("계정을 찾을 수 없습니다."));

        User user = account.getUser();
        if (user == null) {
            throw new UnauthorizedException("연결된 사용자 정보가 없습니다.");
        }

        if (Provider.CAMUS.equals(request.getProvider())
                && !passwordEncoder.matches(request.getPassword(), account.getPasswordHash())) {
            throw new UnauthorizedException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        return user;
    }

    @Transactional(readOnly = true)
    public String refreshAccessToken(String refreshToken) {
        if (refreshToken == null || !jwtTokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Refresh token invalid or expired");
        }

        Long userId = jwtTokenProvider.getUserId(refreshToken);
        if (!refreshTokenService.isValid(userId, refreshToken)) {
            throw new UnauthorizedException("Refresh token invalid or expired");
        }
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);

        return jwtTokenProvider.createAccessToken(user.getId(), user.getEmail(), List.of(user.getRole().name()));
    }

    @Transactional
    public String exchangeExtensionCode(ExtensionTokenExchangeRequest request) {
        Long userId = extensionAuthorizationCodeService.consume(
                request.getCode(),
                request.getRedirectUri(),
                request.getCodeVerifier()
        );
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);

        return jwtTokenProvider.createAccessToken(
                user.getId(),
                user.getEmail(),
                List.of(user.getRole().name())
        );
    }

    @Transactional(readOnly = true)
    public boolean check(String email) {
        return  accountRepository.existsByEmailAndProvider(email, Provider.CAMUS);
    }

    @Transactional
    public ResponseCookie logout(String refreshToken) {
        if (refreshToken != null) {
            try {
                refreshTokenService.delete(jwtTokenProvider.getUserId(refreshToken));
            } catch (RuntimeException ignored) {
                // Logout remains idempotent for malformed or expired cookies.
            }
        }
        return jwtTokenProvider.deleteRefreshTokenCookie();
    }

    private TokenWithRefresh issueSession(Long userId, String email, String role) {
        String accessToken = jwtTokenProvider.createAccessToken(userId, email, List.of(role));
        String refreshToken = jwtTokenProvider.createRefreshToken(userId);
        refreshTokenService.save(userId, refreshToken);
        ResponseCookie refreshCookie = jwtTokenProvider.createRefreshTokenCookie(refreshToken);
        return new TokenWithRefresh(accessToken, refreshCookie);
    }
}
