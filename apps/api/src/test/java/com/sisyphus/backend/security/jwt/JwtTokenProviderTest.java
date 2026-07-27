package com.sisyphus.backend.security.jwt;

import com.sisyphus.backend.global.props.AppProps;
import com.sisyphus.backend.global.props.JwtProps;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseCookie;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    @Test
    void refreshCookieUsesConfiguredSecurityAttributes() {
        JwtProps jwtProps = new JwtProps("a".repeat(32), 900_000, 604_800_000);
        AppProps appProps = new AppProps(
                null,
                null,
                null,
                null,
                new AppProps.Cookie("example.com", true, "None")
        );
        JwtTokenProvider provider = new JwtTokenProvider(jwtProps, appProps);

        ResponseCookie cookie = provider.createRefreshTokenCookie("refresh-token");

        assertThat(cookie.isHttpOnly()).isTrue();
        assertThat(cookie.isSecure()).isTrue();
        assertThat(cookie.getSameSite()).isEqualTo("None");
        assertThat(cookie.getPath()).isEqualTo("/");
        assertThat(cookie.getDomain()).isEqualTo("example.com");
        assertThat(cookie.getMaxAge()).isPositive();
    }

    @Test
    void deletionCookieMatchesScopeAndExpiresImmediately() {
        JwtProps jwtProps = new JwtProps("a".repeat(32), 900_000, 604_800_000);
        AppProps appProps = new AppProps(
                null,
                null,
                null,
                null,
                new AppProps.Cookie("", true, "None")
        );
        JwtTokenProvider provider = new JwtTokenProvider(jwtProps, appProps);

        ResponseCookie cookie = provider.deleteRefreshTokenCookie();

        assertThat(cookie.getValue()).isEmpty();
        assertThat(cookie.getMaxAge()).isZero();
        assertThat(cookie.getPath()).isEqualTo("/");
        assertThat(cookie.getDomain()).isNull();
    }
}
