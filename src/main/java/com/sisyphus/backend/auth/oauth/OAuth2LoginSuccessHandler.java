package com.sisyphus.backend.auth.service;

import com.sisyphus.backend.auth.jwt.JwtTokenProvider;
import com.sisyphus.backend.user.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        User user = findOrSaveUser(email); // 사용자 저장/조회

        // 토큰 생성
        String accessToken = jwtTokenProvider.createAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getId());

        // 리프레시 토큰 저장 (ex: Redis)
        refreshTokenService.save(user.getId(), refreshToken, 7 * 24 * 60 * 60);

        // 쿠키로 설정
        ResponseCookie refreshCookie = jwtTokenProvider.createRefreshTokenCookie(refreshToken);
        response.setHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        // 프론트로 리다이렉트
        response.sendRedirect("http://localhost:5173/oauth/success?token=" + accessToken);
    }
}
