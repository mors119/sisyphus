package com.sisyphus.backend.configuration;


import com.sisyphus.backend.auth.jwt.JwtAuthenticationFilter;
import com.sisyphus.backend.auth.oauth.OAuth2LoginFailureHandler;
import com.sisyphus.backend.auth.oauth.OAuth2LoginSuccessHandler;
import com.sisyphus.backend.auth.oauth.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Arrays;

//  Spring Security 설정 (경로 허용, 필터 등록 등)
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2LoginFailureHandler oAuth2LoginFailureHandler;
    private final Environment env; // 현재 실행중인 profile을 확인하기 위해 주입

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // CSRF JWT 헤더 방식이므로 비활성화 (프론트와 API 서버 분리 시 일반적)
        // 추후 쿠키 인증 방식 도입 시 CSRF 토큰 전략 도입 고려
        http
                // CSRF → JWT 사용 시 항상 비활성화
                .csrf(AbstractHttpConfigurer::disable)
                // 세션 관리 → Stateless (JWT 기반 인증) / 세션 저장 안 함 (JWT 기반 무상태 인증)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 예외 핸들링 → 401, 403 명확하게 커스터마이징 가능 / 로그인 정보 없을 때, /login 으로 redirect 시키는 것 막기 (401오류로 대체)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) ->
                                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"))
                )
                // 경로 권한 관리
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**",
                                "/swagger-ui/**", // TODO: Swagger 배포 시 제한 또는 보호
                                "/v3/api-docs/**", // TODO: Swagger 배포 시 제한 또는 보호
                                "/h2-console/**" // TODO: H2 콘솔 배포 시 제거
                        ).permitAll() // /api/auth/** 같은 인증 제외 경로는 permitAll()
                        .anyRequest().authenticated()
                )
                // 헤더 관리 (H2 console iframe 허용 - local에서만)
                .headers(headers -> {
                //  iframe을 막는 보안 설정 (해제 시 클릭 재킹 위험 있음)
                // H2 콘솔 iframe 허용 → env 사용안 할 경우 배포 시 제거
                    if (isLocalProfile()) {
                        headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin); // local 일 때만 iframe 허용
                    }
                })
                // OAuth2 로그인 설정
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService) // 사용자 정보 가공 (네이버 로그인에 필요)
                        )
                        .failureHandler(oAuth2LoginFailureHandler) //  실패 핸들러 추가
                        .successHandler(oAuth2LoginSuccessHandler) // 토큰 발급 및 쿠키 처리
                )
                // JWT 필터 등록 (기본 UsernamePasswordAuthenticationFilter 앞에 위치) jwtAuthenticationFilter를 UsernamePasswordAuthenticationFilter보다 먼저 실행되도록 등록
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
                // UsernamePasswordAuthenticationFilter는 스프링 시큐리티에서 로그인 처리를 담당하는 기본 필터 (아이디 + 비밀번호로 로그인 시도하는 요청을 처리하는 필터) 제일 마지막에 배치

        return http.build();
    }

    // 현재 profile이 local인지 확인하는 메서드
    private boolean isLocalProfile() {
        return Arrays.asList(env.getActiveProfiles()).contains("local");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
