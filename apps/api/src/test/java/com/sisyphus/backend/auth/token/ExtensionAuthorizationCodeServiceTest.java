package com.sisyphus.backend.auth.token;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sisyphus.backend.global.exception.UnauthorizedException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExtensionAuthorizationCodeServiceTest {

    @Mock
    RedisTemplate<String, String> redisTemplate;

    @Mock
    ValueOperations<String, String> valueOperations;

    @Test
    void codeIsPkceBoundShortLivedAndSingleUse() throws Exception {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        ExtensionAuthorizationCodeService service =
                new ExtensionAuthorizationCodeService(redisTemplate, new ObjectMapper());
        String verifier = "a".repeat(64);
        String challenge = Base64.getUrlEncoder().withoutPadding().encodeToString(
                MessageDigest.getInstance("SHA-256")
                        .digest(verifier.getBytes(StandardCharsets.US_ASCII))
        );

        String code = service.issue(7L, "https://extension.chromiumapp.org", challenge);

        ArgumentCaptor<String> key = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> value = ArgumentCaptor.forClass(String.class);
        verify(valueOperations).set(
                key.capture(),
                value.capture(),
                org.mockito.ArgumentMatchers.eq(ExtensionAuthorizationCodeService.CODE_TTL)
        );
        when(valueOperations.getAndDelete(key.getValue()))
                .thenReturn(value.getValue())
                .thenReturn(null);

        assertThat(service.consume(code, "https://extension.chromiumapp.org", verifier))
                .isEqualTo(7L);
        assertThatThrownBy(
                () -> service.consume(code, "https://extension.chromiumapp.org", verifier)
        ).isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void missingOrExpiredCodeFailsSafely() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        ExtensionAuthorizationCodeService service =
                new ExtensionAuthorizationCodeService(redisTemplate, new ObjectMapper());
        String code = Base64.getUrlEncoder().withoutPadding().encodeToString(new byte[32]);
        when(valueOperations.getAndDelete(org.mockito.ArgumentMatchers.anyString())).thenReturn(null);

        assertThatThrownBy(
                () -> service.consume(code, "https://extension.chromiumapp.org", "a".repeat(64))
        ).isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void wrongPkceVerifierInvalidatesTheCode() throws Exception {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        ExtensionAuthorizationCodeService service =
                new ExtensionAuthorizationCodeService(redisTemplate, new ObjectMapper());
        String verifier = "a".repeat(64);
        String challenge = Base64.getUrlEncoder().withoutPadding().encodeToString(
                MessageDigest.getInstance("SHA-256")
                        .digest(verifier.getBytes(StandardCharsets.US_ASCII))
        );
        String code = service.issue(7L, "https://extension.chromiumapp.org", challenge);
        ArgumentCaptor<String> key = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> value = ArgumentCaptor.forClass(String.class);
        verify(valueOperations).set(
                key.capture(),
                value.capture(),
                org.mockito.ArgumentMatchers.eq(ExtensionAuthorizationCodeService.CODE_TTL)
        );
        when(valueOperations.getAndDelete(key.getValue()))
                .thenReturn(value.getValue())
                .thenReturn(null);

        assertThatThrownBy(
                () -> service.consume(
                        code,
                        "https://extension.chromiumapp.org",
                        "b".repeat(64)
                )
        ).isInstanceOf(UnauthorizedException.class);
        assertThatThrownBy(
                () -> service.consume(code, "https://extension.chromiumapp.org", verifier)
        ).isInstanceOf(UnauthorizedException.class);
    }
}
