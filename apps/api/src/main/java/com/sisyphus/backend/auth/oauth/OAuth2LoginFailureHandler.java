package com.sisyphus.backend.auth.oauth;

import com.sisyphus.backend.global.props.AppProps;
import com.sisyphus.backend.security.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

// OAuth 실패 시 서버에 로그 찍기
@Component
@RequiredArgsConstructor
public class OAuth2LoginFailureHandler implements AuthenticationFailureHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final AppProps appProps;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {

        response.setHeader(
                HttpHeaders.SET_COOKIE,
                jwtTokenProvider.deleteRefreshTokenCookie().toString()
        );

        String mode = (String) request.getSession().getAttribute("mode");
        String redirectedUri = (String) request.getSession().getAttribute("redirectedUri");
        clearOAuthSession(request);

        if ("extension".equals(mode) && redirectedUri != null) {
            response.sendRedirect(
                    UriComponentsBuilder.fromUriString(redirectedUri)
                            .queryParam("error", "oauth_failed")
                            .build()
                            .toUriString()
            );
            return;
        }

        response.sendRedirect(appProps.hosts().app() + "/oauth/success?error=oauth_failed");
    }

    private void clearOAuthSession(HttpServletRequest request) {
        request.getSession().removeAttribute("mode");
        request.getSession().removeAttribute("userId");
        request.getSession().removeAttribute("redirectedUri");
        request.getSession().removeAttribute("codeChallenge");
    }
}
