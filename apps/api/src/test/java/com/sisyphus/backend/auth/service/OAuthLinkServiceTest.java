package com.sisyphus.backend.auth.service;

import com.sisyphus.backend.auth.exception.OAuthLinkValidationException;
import com.sisyphus.backend.global.props.AppProps;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OAuthLinkServiceTest {

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

    private OAuthLinkService service;

    @BeforeEach
    void setUp() {
        service = new OAuthLinkService(appProps);
        when(appProps.hosts()).thenReturn(hosts);
        when(hosts.chromeExtension()).thenReturn("chrome-extension://extensionid");
    }

    @Test
    void extensionOAuthRequiresRegisteredIdentityRedirect() {
        assertThatThrownBy(() -> service.startOAuthFlow(
                request,
                response,
                "google",
                "extension",
                null,
                "https://attacker.example/callback",
                "a".repeat(43),
                "S256"
        )).isInstanceOf(OAuthLinkValidationException.class);
    }

    @Test
    void extensionOAuthStoresOnlyValidatedPkceContext() throws Exception {
        when(request.getSession()).thenReturn(session);
        when(hosts.api()).thenReturn("https://api.example.com");

        service.startOAuthFlow(
                request,
                response,
                "google",
                "extension",
                null,
                "https://extensionid.chromiumapp.org/",
                "a".repeat(43),
                "S256"
        );

        verify(session).setAttribute(OAuthLinkService.SESSION_KEY_MODE, "extension");
        verify(session).setAttribute(
                OAuthLinkService.SESSION_KEY_REDIRECT_URI,
                "https://extensionid.chromiumapp.org"
        );
        verify(session).setAttribute(OAuthLinkService.SESSION_KEY_CODE_CHALLENGE, "a".repeat(43));
        verify(response).sendRedirect(
                "https://api.example.com/oauth2/authorization/google"
        );
    }
}
