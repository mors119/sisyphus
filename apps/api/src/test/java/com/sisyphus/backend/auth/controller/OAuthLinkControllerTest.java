package com.sisyphus.backend.auth.controller;

import com.sisyphus.backend.global.props.AppProps;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OAuthLinkControllerTest {

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

    private OAuthLinkController controller;

    @BeforeEach
    void setUp() {
        controller = new OAuthLinkController(appProps);
        when(appProps.hosts()).thenReturn(hosts);
        when(hosts.chromeExtension()).thenReturn("chrome-extension://extensionid");
    }

    @Test
    void extensionOAuthRequiresRegisteredIdentityRedirect() {
        assertThatThrownBy(() -> controller.redirectToProvider(
                request,
                response,
                OAuthLinkController.OAuthProvider.google,
                "extension",
                null,
                "https://attacker.example/callback",
                "a".repeat(43),
                "S256"
        )).isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void extensionOAuthStoresOnlyValidatedPkceContext() throws Exception {
        when(request.getSession()).thenReturn(session);
        when(hosts.api()).thenReturn("https://api.example.com");

        controller.redirectToProvider(
                request,
                response,
                OAuthLinkController.OAuthProvider.google,
                "extension",
                null,
                "https://extensionid.chromiumapp.org/",
                "a".repeat(43),
                "S256"
        );

        verify(session).setAttribute("mode", "extension");
        verify(session).setAttribute(
                "redirectedUri",
                "https://extensionid.chromiumapp.org"
        );
        verify(session).setAttribute("codeChallenge", "a".repeat(43));
        verify(response).sendRedirect(
                "https://api.example.com/oauth2/authorization/google"
        );
    }
}
