package com.sisyphus.backend.auth.oauth;

import com.sisyphus.backend.auth.token.ExtensionAuthorizationCodeService;
import com.sisyphus.backend.auth.token.RefreshTokenService;
import com.sisyphus.backend.global.exception.OAuthAccountAlreadyLinkedException;
import com.sisyphus.backend.global.props.AppProps;
import com.sisyphus.backend.security.jwt.JwtTokenProvider;
import com.sisyphus.backend.user.dto.AccountUserSnapshot;
import com.sisyphus.backend.user.service.AccountService;
import com.sisyphus.backend.user.util.Provider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final ExtensionAuthorizationCodeService extensionAuthorizationCodeService;
    private final AccountService accountService;
    private final AppProps appProps;

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
        String codeChallenge = (String) request.getSession().getAttribute("codeChallenge");
        
        if ("link".equals(mode) && userIdStr != null) {
            try {
                // userId Long 으로 형변환
                Long userId = Long.parseLong(userIdStr);
                // 연동 처리
                accountService.linkOAuthAccount(userId, name, email, provider);
                // 프론트로 리디렉트
                response.sendRedirect(appProps.hosts().app() + "/link?state=success");
            }
            catch (OAuthAccountAlreadyLinkedException e) {
                response.sendRedirect(appProps.hosts().app() + "/link?state=false");
            } finally {
                clearOAuthSession(request);
            }
            return;
        }

        // 2. 사용자 DB 저장 or 조회
        AccountUserSnapshot user = accountService.saveOrGetAccount(email, name, provider);

        if ("extension".equals(mode)) {
            if (redirectedUri == null || codeChallenge == null) {
                clearOAuthSession(request);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid extension OAuth state");
                return;
            }
            String code = extensionAuthorizationCodeService.issue(
                    user.id(),
                    redirectedUri,
                    codeChallenge
            );
            clearOAuthSession(request);
            response.sendRedirect(
                    UriComponentsBuilder.fromUriString(redirectedUri)
                            .queryParam("code", code)
                            .build()
                            .toUriString()
            );
            return;
        }

        String refreshToken = jwtTokenProvider.createRefreshToken(user.id());
        refreshTokenService.save(user.id(), refreshToken);

        ResponseCookie cookie = jwtTokenProvider.createRefreshTokenCookie(refreshToken);
        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        clearOAuthSession(request);
        response.sendRedirect(appProps.hosts().app() + "/oauth/success");
    }

    private void clearOAuthSession(HttpServletRequest request) {
        request.getSession().removeAttribute("mode");
        request.getSession().removeAttribute("userId");
        request.getSession().removeAttribute("redirectedUri");
        request.getSession().removeAttribute("codeChallenge");
    }
}
