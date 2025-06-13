package com.sisyphus.backend.auth.token;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RedisTemplate<String, String> redisTemplate;
    private static final String PREFIX = "refresh:";

    // 저장
    public void save(Long userId, String refreshToken, long expirationSeconds) {
        redisTemplate.opsForValue().set(
                PREFIX + userId,
                refreshToken,
                Duration.ofSeconds(expirationSeconds)
        );
    }

    // 조회
    public String get(Long userId) {
        return redisTemplate.opsForValue().get(PREFIX + userId);
    }

    // 삭제
    public void delete(Long userId) {
        redisTemplate.delete(PREFIX + userId);
    }

    // 검증
    public boolean isValid(Long userId, String token) {
        String saved = get(userId);
        return token.equals(saved);
    }
}
