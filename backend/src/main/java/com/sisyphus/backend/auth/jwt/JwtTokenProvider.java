package com.sisyphus.backend.auth.jwt;


import com.sisyphus.backend.auth.security.UserPrincipal;
import com.sisyphus.backend.global.exception.UnauthorizedException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

// JWT 생성/파싱/검증 기능
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    // 7일
    private static final long REFRESH_TOKEN_EXPIRATION_SEC = 7L * 24 * 60 * 60;

    // secretKey 와 expiration 은 application.properties 에서 주입
    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    // 문자열 SecretKey → SecretKey 객체로 변환 (HMAC-SHA256용) 버전 업데이트 후 단순 문자열 막기
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }


    // jwt 토큰 생성 (로그인 시 사용)
    public String createAccessToken(Long userId, String email) {
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("userId", userId);

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)  // 최신 방식
                .compact();
    }

    // RefreshToken 발급
    public String createRefreshToken(Long userId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + refreshExpiration); // 예: 7일

        Claims claims = Jwts.claims().setSubject(String.valueOf(userId));

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 인증 객체 생성 (SecurityContext에 넣기 위함)
    public Authentication getAuthentication(String token) {
        UserPrincipal userPrincipal = getUserPrincipal(token);
        return new UsernamePasswordAuthenticationToken(userPrincipal, "", userPrincipal.getAuthorities());
    }

    // JWT에서 사용자 정보 꺼내기
    public UserPrincipal getUserPrincipal(String token) {
        Claims claims = parseClaims(token);

        Integer userIdInt = claims.get("userId", Integer.class);
        if (userIdInt == null) {
            throw new UnauthorizedException("JWT 토큰에 userId가 존재하지 않습니다.");
        }

        Long userId = userIdInt.longValue();
        String email = claims.getSubject();

        return new UserPrincipal(userId, email);
    }

    // JWT를 파싱해서 Claims 객체 반환
    public Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())  // 여기서도 최신 방식 적용
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 서명 검증, 유효성 검사
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())  // 마찬가지
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // RefreshToken 을 담는 유틸 함수
    public ResponseCookie createRefreshTokenCookie(String refreshToken) {
        return ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true) // HTTPS 사용 시 true 권장
                .sameSite("Strict")
                .path("/")
                .maxAge(REFRESH_TOKEN_EXPIRATION_SEC) // 7일
                .build();
    }

    // 서버에서 쿠키 삭제
    public ResponseCookie deleteRefreshTokenCookie() {
        return ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0) // ✅ 만료 즉시
                .sameSite("Strict")
                .build();
    }

    // jwt token으로 userid 값 꺼내기
    public Long getUserId(String token) {
        Claims claims = parseClaims(token); // JWT payload 꺼내기
        return claims.get("userId", Integer.class).longValue(); // 이 부분 중요
    }

    public String resolveToken(HttpServletRequest request) {

        // 요청 헤더에서 Authorization 값을 추출해서 토큰만 뽑음
        String bearer = request.getHeader("Authorization");

        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }

        return null;
    }

}
