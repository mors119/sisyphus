package com.sisyphus.backend.auth.token;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sisyphus.backend.global.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class ExtensionAuthorizationCodeService {

    static final Duration CODE_TTL = Duration.ofSeconds(60);
    private static final String PREFIX = "oauth:extension:code:";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    public String issue(Long userId, String redirectUri, String codeChallenge) {
        validateCodeChallenge(codeChallenge);

        byte[] randomBytes = new byte[32];
        SECURE_RANDOM.nextBytes(randomBytes);
        String code = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        try {
            String value = objectMapper.writeValueAsString(
                    new StoredAuthorization(userId, redirectUri, codeChallenge)
            );
            redisTemplate.opsForValue().set(key(code), value, CODE_TTL);
            return code;
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Could not create extension authorization code", e);
        }
    }

    public Long consume(String code, String redirectUri, String codeVerifier) {
        if (code == null || !code.matches("^[A-Za-z0-9_-]{43}$")) {
            throw invalidCode();
        }
        validateCodeVerifier(codeVerifier);

        String storedValue = redisTemplate.opsForValue().getAndDelete(key(code));
        if (storedValue == null) {
            throw invalidCode();
        }

        try {
            StoredAuthorization stored = objectMapper.readValue(storedValue, StoredAuthorization.class);
            String actualChallenge = sha256Base64Url(codeVerifier);

            if (!constantTimeEquals(stored.redirectUri(), redirectUri)
                    || !constantTimeEquals(stored.codeChallenge(), actualChallenge)) {
                throw invalidCode();
            }

            return stored.userId();
        } catch (JsonProcessingException e) {
            throw invalidCode();
        }
    }

    private void validateCodeChallenge(String codeChallenge) {
        if (codeChallenge == null || !codeChallenge.matches("^[A-Za-z0-9_-]{43}$")) {
            throw new IllegalArgumentException("A valid S256 PKCE challenge is required");
        }
    }

    private void validateCodeVerifier(String codeVerifier) {
        if (codeVerifier == null
                || codeVerifier.length() < 43
                || codeVerifier.length() > 128
                || !codeVerifier.matches("^[A-Za-z0-9._~-]+$")) {
            throw invalidCode();
        }
    }

    private String key(String code) {
        return PREFIX + sha256Base64Url(code);
    }

    private String sha256Base64Url(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.US_ASCII));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is unavailable", e);
        }
    }

    private boolean constantTimeEquals(String expected, String actual) {
        if (expected == null || actual == null) {
            return false;
        }
        return MessageDigest.isEqual(
                expected.getBytes(StandardCharsets.UTF_8),
                actual.getBytes(StandardCharsets.UTF_8)
        );
    }

    private UnauthorizedException invalidCode() {
        return new UnauthorizedException("Extension authorization code is invalid or expired");
    }

    private record StoredAuthorization(Long userId, String redirectUri, String codeChallenge) {
    }
}
