package com.sisyphus.backend.auth.service;

import com.sisyphus.backend.auth.dto.LoginRequest;
import com.sisyphus.backend.auth.dto.RegisterRequest;
import com.sisyphus.backend.auth.token.RefreshTokenService;
import com.sisyphus.backend.auth.dto.TokenWithRefresh;
import com.sisyphus.backend.auth.jwt.JwtTokenProvider;
import com.sisyphus.backend.global.exception.UnauthorizedException;
import com.sisyphus.backend.user.entity.Account;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.repository.AccountRepository;
import com.sisyphus.backend.user.repository.UserRepository;
import com.sisyphus.backend.user.util.Provider;
import com.sisyphus.backend.user.util.Role;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Optional;

// 로그인/회원가입 로직과 JWT 발급 처리
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final MessageSource messageSource;
    private final RefreshTokenService refreshTokenService;
    private final AccountRepository accountRepository;


    // OAuth -> account 정보 저장
    // TIP: O Auth 정보를 DB에 저장 *** AuthService에 아래처럼 순환참조 오류가 발생
    @Transactional
    public Account saveOrLinkAccount(RegisterRequest request, Locale locale) {
        Provider provider = request.getProvider();
        String email = request.getEmail();
        String name = request.getName();

        // 1. 이미 존재하는 Account가 있다면 그대로 반환
        Optional<Account> existingAccount = accountRepository.findByEmailAndProvider(email, provider);
        if (existingAccount.isPresent()) return existingAccount.get();

        // 처음 가입하는 아이디만 role admin 설정
        boolean isFirstUser = userRepository.count() == 0;
        Role role = isFirstUser ? Role.ADMIN : Role.USER;

        // 2. 같은 이메일을 가진 User가 있는지 확인 (User는 이메일 기준으로 통합)
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(new User(email, name, role)));

        // 3. provider에 따라 Account 생성 방식 분기
        Account account;
        if (provider == null) {
            // 로컬 계정은 비밀번호 인코딩 포함
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            account = Account.ofLocal(email, name, encodedPassword);
        } else {
            // OAuth 계정은 비밀번호 필요 없음
            account = Account.ofOauth(email, name, provider);
        }

        // 4. User와 연결
        account.linkToUser(user);

        // 5. 저장
        return accountRepository.save(account);
    }

    // 로그인 로직 실행 후 jwtToken 반환
    public TokenWithRefresh login(LoginRequest request) {
        // 1. Account 조회
        Account account = accountRepository.findByEmailAndProviderFetchUser(
                        request.getEmail(), request.getProvider())
                .orElseThrow(() -> new UnauthorizedException("계정을 찾을 수 없습니다."));

        // 2. 연결된 User 확인
        User user = account.getUser();
        if (user == null) {
            throw new UnauthorizedException("연결된 사용자 정보가 없습니다.");
        }

        // 3. camus (local) 로그인 시 비밀번호 검증
        if (Provider.CAMUS.equals(request.getProvider()) && !passwordEncoder.matches(request.getPassword(), account.getPasswordHash())) {
                throw new UnauthorizedException("이메일 또는 비밀번호가 올바르지 않습니다.");
            }
        // 4. 토큰 발급
        String accessToken = jwtTokenProvider.createAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getId());
        refreshTokenService.save(user.getId(), refreshToken, 7L * 24 * 60 * 60);
        ResponseCookie refreshCookie = jwtTokenProvider.createRefreshTokenCookie(refreshToken);

        return new TokenWithRefresh(accessToken, refreshCookie);
    }

    // access 토큰 재발급
    public String refreshAccessToken(String refreshToken, Locale locale) {
        if (!jwtTokenProvider.validateToken(refreshToken))
            throw new UnauthorizedException(messageSource.getMessage("auth.login.invalid", null, locale));

        // userId 추출
        Long userId = jwtTokenProvider.getUserId(refreshToken);
        User user = userRepository.findById(userId).orElseThrow();

        return jwtTokenProvider.createAccessToken(user.getId(), user.getEmail());
    }

    // 아이디 중복 확인
    public boolean check(@NotBlank(message = "{auth.email.blank}") @Email(message = "{auth.email.invalid}") String email) {
        return  accountRepository.existsByEmailAndProvider(email, Provider.CAMUS);
    }


}
