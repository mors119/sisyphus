package com.sisyphus.backend.auth.jwt;

import com.sisyphus.backend.auth.security.UserPrincipal;
import com.sisyphus.backend.configuration.JwtProps;
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
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * JWT 생성/파싱/검증 유틸리티
 * - Access/Refresh 토큰 발급
 * - 요청 헤더에서 토큰 추출
 * - 토큰 → Authentication 변환(권한 포함)
 * - 토큰 파싱/서명 검증
 */
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProps jwt;

    /** HTTP 쿠키 이름: refresh token 저장용 */
    public static final String REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
    /** 헤더 토큰 prefix */
    public static final String TOKEN_PREFIX = "Bearer ";
    /** 인증 헤더 키 */
    public static final String HEADER_STRING = "Authorization";

    /** 토큰 클레임 키들 */
    public static final String USER_ID_KEY = "userId";
    public static final String ROLES_KEY   = "roles"; // 예: ["ADMIN","USER"]

    /** RefreshToken 기본 만료(초) */
    private static final long REFRESH_TOKEN_EXPIRATION_SEC = 7L * 24 * 60 * 60; // 7일

    /** 서명용 SecretKey (HMAC-SHA) */
    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(jwt.secret().getBytes(StandardCharsets.UTF_8));
    }

    // ---------------------------------------------------
    //              토큰 생성(Access/Refresh)
    // ---------------------------------------------------

    /**
     * AccessToken 생성 (roles 포함 버전)
     * @param userId 사용자 PK
     * @param email  사용자 이메일(토큰 subject)
     * @param roles  사용자 권한 목록(예: ["ADMIN","USER"])
     */
    public String createAccessToken(Long userId, String email, List<String> roles) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(email)
                .claim(USER_ID_KEY, userId)
                .claim(ROLES_KEY, roles) // null이면 JJWT가 자동으로 누락
                .issuedAt(new Date(now))
                .expiration(new Date(now + jwt.expiration()))     // ms 단위
                .signWith(signingKey())                           // JJWT 0.12 스타일
                .compact();
    }

    /**
     * AccessToken 생성 (roles 미포함 간편 버전)
     */
    public String createAccessToken(Long userId, String email) {
        return createAccessToken(userId, email, null);
    }

    /**
     * RefreshToken 생성 (권한 없이 userId만 포함)
     */
    public String createRefreshToken(Long userId) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim(USER_ID_KEY, userId)
                .issuedAt(new Date(now))
                .expiration(new Date(now + jwt.refreshExpiration())) // ms 단위
                .signWith(signingKey())
                .compact();
    }

    // ---------------------------------------------------
    //            토큰 → Authentication 변환
    // ---------------------------------------------------

    /**
     * 토큰을 파싱하여 Authentication을 생성
     * - SecurityContext에 넣어 스프링 시큐리티 인가(@PreAuthorize 등)에서 사용
     * - roles 클레임을 ROLE_ 접두사 권한으로 변환해야 hasRole('ADMIN')이 동작
     */
    public Authentication getAuthentication(String token) {
        Claims claims = parseClaims(token);

        Number userIdNum = claims.get(USER_ID_KEY, Number.class);
        if (userIdNum == null) throw new UnauthorizedException("JWT 토큰에 userId가 없습니다.");

        Long userId = userIdNum.longValue();
        String email = claims.getSubject();

        @SuppressWarnings("unchecked")
        List<String> roles = claims.get(ROLES_KEY, List.class); // ["ADMIN","USER"] 또는 null
        var authorities = roles == null
                ? List.<SimpleGrantedAuthority>of()
                : roles.stream()
                .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                .collect(Collectors.toList());

        UserPrincipal principal = new UserPrincipal(userId, email);
        return new UsernamePasswordAuthenticationToken(principal, null, authorities);
    }

    // ---------------------------------------------------
    //                 토큰 파싱/검증
    // ---------------------------------------------------

    /**
     * JWT에서 사용자 정보만 꺼내야 할 때 사용(토큰 → UserPrincipal)
     */
    public UserPrincipal getUserPrincipal(String token) {
        Claims claims = parseClaims(token);

        Integer userIdInt = claims.get(USER_ID_KEY, Integer.class);
        if (userIdInt == null) {
            throw new UnauthorizedException("JWT 토큰에 userId가 존재하지 않습니다.");
        }

        Long userId = userIdInt.longValue();
        String email = claims.getSubject();

        return new UserPrincipal(userId, email);
    }

    /**
     * Raw JWT를 파싱하여 Claims 반환(서명 검증 포함)
     */
    public Claims parseClaims(String token) {
        // JJWT 0.12: parser().verifyWith(key).build().parseSignedClaims(token)
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * 토큰 서명/형식/만료 검증
     * @return 유효하면 true, 그 외 false
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token); // 파싱에서 예외 나면 무효
            return true;
        } catch (RuntimeException e) {
            return false;
        }
    }

    // ---------------------------------------------------
    //                 쿠키 유틸(리프레시)
    // ---------------------------------------------------

    /*
     sameSite
       - Strict: 같은 출처 요청에만 쿠키 포함(보안 ↑, UX ↓)
       - Lax: GET 허용, POST 등은 제한(기본값)
       - None: 모든 cross-site에 포함 → 이 경우 반드시 .secure(true)
     secure
       - HTTPS에서 true
    */

    /** RefreshToken을 Set-Cookie로 내려줄 때 사용 (SameSite=None → secure true 필수) */
    public ResponseCookie createRefreshTokenCookie(String refreshToken) {
        int maxAgeSec = (int) Math.min(jwt.refreshExpiration() / 1000L, Integer.MAX_VALUE);
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(maxAgeSec) // ms → sec 변환
                .build();
    }

    /** RefreshToken 쿠키 삭제 */
    public ResponseCookie deleteRefreshTokenCookie() {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0) // 즉시 만료
                .build();
    }

    // ---------------------------------------------------
    //                 편의 메서드들
    // ---------------------------------------------------

    /** 토큰에서 userId만 꺼내기 */
    public Long getUserId(String token) {
        Number userId = parseClaims(token).get(USER_ID_KEY, Number.class);
        if (userId == null) throw new UnauthorizedException("Invalid token: missing userId");
        return userId.longValue();
    }

    /** HTTP 요청 헤더에서 Bearer 토큰 추출 */
    public String resolveToken(HttpServletRequest request) {
        // 예: Authorization: Bearer eyJhbGciOiJI...
        String bearer = request.getHeader(HEADER_STRING);
        if (bearer != null && bearer.startsWith(TOKEN_PREFIX)) {
            return bearer.substring(TOKEN_PREFIX.length()); // 접두사 길이만큼 안전하게 제거
        }
        return null;
    }
}
