package com.sisyphus.backend.auth.oauth;

import com.sisyphus.backend.auth.token.ExtensionAuthorizationCodeService;
import com.sisyphus.backend.auth.token.RefreshTokenService;
import com.sisyphus.backend.global.props.AppProps;
import com.sisyphus.backend.security.jwt.JwtTokenProvider;
import com.sisyphus.backend.user.dto.UserRequest;
import com.sisyphus.backend.user.service.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseCookie;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OAuth2LoginSuccessHandlerTest {

    @Mock
    JwtTokenProvider jwtTokenProvider;
    @Mock
    RefreshTokenService refreshTokenService;
    @Mock
    ExtensionAuthorizationCodeService extensionAuthorizationCodeService;
    @Mock
    AccountService accountService;
    @Mock
    AppProps appProps;
    @Mock
    AppProps.Hosts hosts;
    @Mock
    HttpServletRequest request;
    @Mock
    HttpServletResponse response;
    @Mock
    HttpSession session;
    @Mock
    OAuth2AuthenticationToken authentication;
    @Mock
    OAuth2User oauthUser;

    private OAuth2LoginSuccessHandler handler;
    private UserRequest user;

    @BeforeEach
    void setUp() {
        handler = new OAuth2LoginSuccessHandler(
                jwtTokenProvider,
                refreshTokenService,
                extensionAuthorizationCodeService,
                accountService,
                appProps
        );
        user = new UserRequest();
        user.setId(1L);
        user.setEmail("user@example.com");

        when(request.getSession()).thenReturn(session);
        when(authentication.getPrincipal()).thenReturn(oauthUser);
        when(authentication.getAuthorizedClientRegistrationId()).thenReturn("google");
        when(oauthUser.getAttribute("email")).thenReturn("user@example.com");
        when(oauthUser.getAttribute("name")).thenReturn("User");
        when(accountService.saveOrGetAccount(any(), any(), any())).thenReturn(user);
    }

    @Test
    void webRedirectContainsNoCredentialMaterial() throws Exception {
        when(appProps.hosts()).thenReturn(hosts);
        when(hosts.app()).thenReturn("https://app.example.com");
        when(jwtTokenProvider.createRefreshToken(1L)).thenReturn("refresh-token");
        when(jwtTokenProvider.createRefreshTokenCookie("refresh-token"))
                .thenReturn(ResponseCookie.from("refreshToken", "refresh-token").build());

        handler.onAuthenticationSuccess(request, response, authentication);

        verify(response).sendRedirect("https://app.example.com/oauth/success");
        verify(jwtTokenProvider, never()).createAccessToken(anyLong(), any(), any());
    }

    @Test
    void extensionRedirectUsesOnlySingleUseCodeAndSetsNoRefreshCookie() throws Exception {
        when(session.getAttribute(any())).thenAnswer(invocation -> switch ((String) invocation.getArgument(0)) {
            case "mode" -> "extension";
            case "redirectedUri" -> "https://extension.chromiumapp.org";
            case "codeChallenge" -> "a".repeat(43);
            default -> null;
        });
        when(extensionAuthorizationCodeService.issue(
                1L,
                "https://extension.chromiumapp.org",
                "a".repeat(43)
        )).thenReturn("one-time-code");

        handler.onAuthenticationSuccess(request, response, authentication);

        verify(response).sendRedirect(
                "https://extension.chromiumapp.org?code=one-time-code"
        );
        verify(jwtTokenProvider, never()).createAccessToken(anyLong(), any(), any());
        verify(jwtTokenProvider, never()).createRefreshToken(anyLong());
        verify(refreshTokenService, never()).save(anyLong(), any(), anyLong());
        assertThat("https://extension.chromiumapp.org?code=one-time-code")
                .doesNotContain("token=", "access_token=", "refresh_token=");
    }
}
