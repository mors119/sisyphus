package com.sisyphus.backend.auth.controller;

import com.sisyphus.backend.auth.service.OAuthLinkService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class OAuthLinkControllerTest {

    @Mock
    OAuthLinkService oauthLinkService;
    @Mock
    HttpServletRequest request;
    @Mock
    HttpServletResponse response;

    private OAuthLinkController controller;

    @BeforeEach
    void setUp() {
        controller = new OAuthLinkController(oauthLinkService);
    }

    @Test
    void delegatesOAuthStartToService() throws Exception {
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

        verify(oauthLinkService).startOAuthFlow(
                request,
                response,
                "google",
                "extension",
                null,
                "https://extensionid.chromiumapp.org/",
                "a".repeat(43),
                "S256"
        );
    }
}
