package com.sisyphus.backend.auth.jwt;

import com.sisyphus.backend.global.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtTokenHandler {

    private final JwtTokenProvider jwtTokenProvider;
    /**
     * 요청에서 JWT 토큰을 추출하고 검증한 뒤, userId를 반환합니다.
     *
     * @param request HttpServletRequest (Authorization 헤더 포함)
     * @return 유효한 토큰에서 추출한 사용자 ID
     * @throws UnauthorizedException 토큰이 없거나 유효하지 않을 경우
     */
    public Long extractUserIdFromRequest(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException("유효하지 않은 토큰입니다.");
        }
        return jwtTokenProvider.getUserId(token);
    }
}
