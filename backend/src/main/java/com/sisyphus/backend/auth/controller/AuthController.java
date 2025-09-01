package com.sisyphus.backend.auth.controller;

import com.sisyphus.backend.auth.dto.*;
import com.sisyphus.backend.auth.service.EmailAuthService;
import com.sisyphus.backend.auth.token.TokenResponse;
import com.sisyphus.backend.auth.jwt.JwtTokenProvider;
import com.sisyphus.backend.auth.service.AuthService;
import com.sisyphus.backend.auth.token.RefreshTokenService;
import com.sisyphus.backend.global.exception.UnauthorizedException;
import com.sisyphus.backend.user.entity.Account;
import com.sisyphus.backend.user.entity.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

//  로그인 및 회원가입
@Slf4j
@RequestMapping("/api/auth")
@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final EmailAuthService emailAuthService;

    // 회원 가입
    @PostMapping("/signup")
    public ResponseEntity<TokenResponse> signup(@RequestBody RegisterRequest request, Locale locale) {
        // 회원가입 처리
        Account account = authService.saveOrLinkAccount(request, locale);
        User user = account.getUser();
        if (user == null) {
            throw new UnauthorizedException("연결된 사용자 정보가 없습니다.");
        }

        String accessToken = jwtTokenProvider.createAccessToken(user.getId(), user.getEmail(), List.of(user.getRole().name()));
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getId());

        // RefreshToken 쿠키로 설정
        ResponseCookie refreshCookie = jwtTokenProvider.createRefreshTokenCookie(refreshToken);

        // accessToken: JSON 응답 바디에 포함
        // refreshToken: HttpOnly 쿠키에 담아 전송
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(new TokenResponse(accessToken)); // AccessToken은 응답 바디
    }

    // RefreshToken 추출
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(@CookieValue(name = JwtTokenProvider.REFRESH_TOKEN_COOKIE_NAME, required = false) String refreshToken, Locale locale) {
        // 쿠키에서 refreshToken 추출
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // userId 추출
        Long userId = jwtTokenProvider.getUserId(refreshToken);

        // Redis 저장소에서 토큰 유효성 확인
        if (!refreshTokenService.isValid(userId, refreshToken)) {
            throw new UnauthorizedException("Refresh token invalid or expired");
        }

        // accessToken 재발급
        String newAccessToken = authService.refreshAccessToken(refreshToken, locale);
        return ResponseEntity.ok(new TokenResponse(newAccessToken));
    }

    // 요청(HttpServletRequest)에서 값을 추출하는 유틸성 함수 (구형) -> @CookieValue
//    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
//        if (request.getCookies() == null) return null;
//
//        for (Cookie cookie : request.getCookies()) {
//            if ("refreshToken".equals(cookie.getName())) {
//                return cookie.getValue();
//            }
//        }
//        return null;
//    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
        TokenWithRefresh loginResult = authService.login(request);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, loginResult.getRefreshCookie().toString())
                .body(new TokenResponse(loginResult.getAccessToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@CookieValue(name = JwtTokenProvider.REFRESH_TOKEN_COOKIE_NAME, required = false) String refreshToken) {

        if (refreshToken != null) {
            try {
                // 서버 저장소에서 무효화 처리
                Long userId = jwtTokenProvider.getUserId(refreshToken);
                refreshTokenService.delete(userId);
            } catch (Exception e) {
                // refreshToken이 유효하지 않더라도, 로그아웃의 주 목적인 쿠키 삭제는 계속 진행해야 하므로 로깅만 하고 예외를 던지지 않는다.
                 log.warn("Invalid refresh token during logout: {}", e.getMessage());
            }
        }

        // 클라이언트 쿠키 삭제
        ResponseCookie deleteCookie = jwtTokenProvider.deleteRefreshTokenCookie();

        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .build();
    }

    // 이메일 중복 확인
    @PostMapping("check")
    public ResponseEntity<Boolean> check(@RequestBody LoginRequest request, Locale locale) {
        boolean rs = authService.check(request.getEmail());

        return ResponseEntity.ok(rs);
    }

    // 이메일 코드 전송
    @PostMapping("/send-email")
    public ResponseEntity<String> sendVerificationCode(@RequestBody EmailRequest request) {
        emailAuthService.sendCodeToEmail(request.getEmail());
        return ResponseEntity.ok("인증 코드가 전송되었습니다.");
    }

    // 이메일 검증
    @PostMapping("/verify-email")
    public ResponseEntity<Boolean> verifyCode(@RequestBody EmailVerifyRequest request) {
        boolean isValid = emailAuthService.verifyCode(request.getEmail(), request.getCode());
        return ResponseEntity.ok(isValid);
    }
}