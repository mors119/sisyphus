package com.sisyphus.backend.auth.oauth;

import com.sisyphus.backend.auth.jwt.JwtTokenHandler;
import com.sisyphus.backend.auth.jwt.JwtTokenProvider;
import com.sisyphus.backend.auth.token.RefreshTokenService;
import com.sisyphus.backend.global.exception.OAuthAccountAlreadyLinkedException;
import com.sisyphus.backend.user.dto.UserRequest;
import com.sisyphus.backend.user.service.AccountService;
import com.sisyphus.backend.user.util.Provider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final AccountService accountService;
    private final JwtTokenHandler jwtTokenHandler;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        String rawProvider = oauthToken.getAuthorizedClientRegistrationId(); // ex: "google", "naver"
        Provider provider = Provider.from(rawProvider); // enum으로 안전하게 변환

        // 1. oAuth2User 객체에서 정보 꺼내기
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // 1-2. session.attribute 값 꺼내기
        String mode = (String) request.getSession().getAttribute("mode");
        String userIdStr = (String) request.getSession().getAttribute("userId");
        String redirectedUri = (String) request.getSession().getAttribute("redirectedUri");

        System.out.println("userIdStr = " + userIdStr);
        System.out.println("mode = " + mode);
        
        if ("link".equals(mode) && userIdStr != null) {
            try {
                // userId Long 으로 형변환
                Long userId = Long.parseLong(userIdStr);
                // 연동 처리
                accountService.linkOAuthAccount(userId, name, email, provider);
                // 프론트로 리디렉트
                response.sendRedirect(frontendUrl + "/link?state=success");
            }
            catch (OAuthAccountAlreadyLinkedException e) {
                response.sendRedirect(frontendUrl + "/link?state=false");
            } finally {
                // session 초기화
                request.getSession().removeAttribute("mode");
                request.getSession().removeAttribute("userId");
            }
            return;
        }

        // 2. 사용자 DB 저장 or 조회
        UserRequest userRequest = accountService.saveOrGetAccount(email, name, provider);

        // 3. access + refresh 토큰 발급
        String accessToken = jwtTokenProvider.createAccessToken(userRequest.getId(), userRequest.getEmail());
        String refreshToken = jwtTokenProvider.createRefreshToken(userRequest.getId());

        // 4. refresh 토큰 저장 (ex: Redis)
        refreshTokenService.save(userRequest.getId(), refreshToken, 7L * 24 * 60 * 60);

        // 5. refresh 토큰을 쿠키로 응답에 포함
        ResponseCookie cookie = jwtTokenProvider.createRefreshTokenCookie(refreshToken);
        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // 6. accessToken은 프론트로 리다이렉트 (query string 전달)

        if("extension".equals(mode) && redirectedUri != null) {

            request.getSession().removeAttribute("mode");
            request.getSession().removeAttribute("redirectedUri");

            response.sendRedirect(redirectedUri + "?token=" + accessToken);
            return;
        }

        // TODO: URL 변경
        response.sendRedirect(frontendUrl + "/oauth/success?token=" + accessToken);
    }
}
