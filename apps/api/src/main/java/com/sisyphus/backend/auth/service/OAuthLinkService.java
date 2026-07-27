package com.sisyphus.backend.auth.service;

import com.sisyphus.backend.auth.exception.OAuthLinkValidationException;
import com.sisyphus.backend.global.exception.InvalidApplicationConfigurationException;
import com.sisyphus.backend.global.props.AppProps;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;

@Service
@RequiredArgsConstructor
public class OAuthLinkService {

    private final AppProps appProps;

    static final String SESSION_KEY_MODE = "mode";
    static final String SESSION_KEY_USER_ID = "userId";
    static final String SESSION_KEY_REDIRECT_URI = "redirectedUri";
    static final String SESSION_KEY_CODE_CHALLENGE = "codeChallenge";

    private static final String MODE_LINK = "link";
    private static final String MODE_EXTENSION = "extension";

    public void startOAuthFlow(
            HttpServletRequest request,
            HttpServletResponse response,
            String provider,
            String mode,
            String userId,
            String redirectedUri,
            String codeChallenge,
            String codeChallengeMethod
    ) throws IOException {
        validateParams(mode, userId, redirectedUri, codeChallenge, codeChallengeMethod);
        String canonicalRedirectUri = MODE_EXTENSION.equals(mode)
                ? normalizeRedirectUri(redirectedUri)
                : redirectedUri;
        persistSessionAttributes(request, mode, userId, canonicalRedirectUri, codeChallenge);

        response.sendRedirect(appProps.hosts().api() + "/oauth2/authorization/" + provider);
    }

    private void persistSessionAttributes(
            HttpServletRequest request,
            String mode,
            String userId,
            String redirectedUri,
            String codeChallenge
    ) {
        clearSessionAttributes(request);
        if (mode == null) {
            return;
        }

        if (MODE_LINK.equals(mode)) {
            request.getSession().setAttribute(SESSION_KEY_MODE, MODE_LINK);
            request.getSession().setAttribute(SESSION_KEY_USER_ID, userId);
            return;
        }

        if (MODE_EXTENSION.equals(mode)) {
            request.getSession().setAttribute(SESSION_KEY_MODE, MODE_EXTENSION);
            request.getSession().setAttribute(SESSION_KEY_REDIRECT_URI, redirectedUri);
            request.getSession().setAttribute(SESSION_KEY_CODE_CHALLENGE, codeChallenge);
        }
    }

    private void clearSessionAttributes(HttpServletRequest request) {
        request.getSession().removeAttribute(SESSION_KEY_MODE);
        request.getSession().removeAttribute(SESSION_KEY_USER_ID);
        request.getSession().removeAttribute(SESSION_KEY_REDIRECT_URI);
        request.getSession().removeAttribute(SESSION_KEY_CODE_CHALLENGE);
    }

    private void validateParams(
            String mode,
            String userId,
            String redirectedUri,
            String codeChallenge,
            String codeChallengeMethod
    ) {
        if (mode == null) {
            return;
        }

        if (MODE_LINK.equals(mode)) {
            if (userId == null || userId.isBlank()) {
                throw new OAuthLinkValidationException("mode=link requires userId");
            }
            return;
        }

        if (MODE_EXTENSION.equals(mode)) {
            if (redirectedUri == null || redirectedUri.isBlank()) {
                throw new OAuthLinkValidationException("mode=extension requires redirectedUri");
            }
            if (!expectedExtensionRedirectUri().equals(normalizeRedirectUri(redirectedUri))) {
                throw new OAuthLinkValidationException(
                        "redirectedUri is not registered for this extension"
                );
            }
            if (!"S256".equals(codeChallengeMethod)
                    || codeChallenge == null
                    || !codeChallenge.matches("^[A-Za-z0-9_-]{43}$")) {
                throw new OAuthLinkValidationException(
                        "mode=extension requires a valid S256 PKCE challenge"
                );
            }
            return;
        }

        throw new OAuthLinkValidationException("Invalid mode: " + mode);
    }

    private String expectedExtensionRedirectUri() {
        URI extensionOrigin = URI.create(appProps.hosts().chromeExtension());
        String extensionId = extensionOrigin.getHost();
        if (extensionId == null || extensionId.isBlank()) {
            throw new InvalidApplicationConfigurationException(
                    "app.hosts.chrome-extension must contain an extension ID"
            );
        }
        return "https://" + extensionId + ".chromiumapp.org";
    }

    private String normalizeRedirectUri(String redirectUri) {
        return redirectUri.endsWith("/")
                ? redirectUri.substring(0, redirectUri.length() - 1)
                : redirectUri;
    }
}
