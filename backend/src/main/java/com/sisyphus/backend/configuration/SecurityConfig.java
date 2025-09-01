package com.sisyphus.backend.configuration;


import com.sisyphus.backend.auth.jwt.JwtAuthenticationFilter;
import com.sisyphus.backend.auth.oauth.CustomOAuth2UserService;
import com.sisyphus.backend.auth.oauth.OAuth2LoginFailureHandler;
import com.sisyphus.backend.auth.oauth.OAuth2LoginSuccessHandler;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Arrays;

/**
 * Spring Security 전역 (경로 허용, 필터 등록 등) 설정  클래스입니다.
 *
 * <p>기능 요약:
 * <ul>
 *     <li>JWT 기반 무상태 인증 (Stateless)</li>
 *     <li>OAuth2 로그인 연동 (Google, Naver, Kakao)</li>
 *     <li>CSRF 비활성화</li>
 *     <li>세션 비활성화</li>
 *     <li>Swagger, H2 Console 등의 예외 경로 허용</li>
 *     <li>커스텀 로그인 성공/실패 핸들러 및 필터 설정</li>
 * </ul>
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // @PreAuthorize/@PostAuthorize 활성화(관리자 인증)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2LoginFailureHandler oAuth2LoginFailureHandler;
    private final Environment env; // 현재 실행중인 profile을 확인하기 위해 주입
    private final ClientRegistrationRepository clientRegistrationRepository;



    /**
     * Spring Security의 필터 체인을 정의합니다.
     *
     * <p>주요 설정:
     * <ul>
     *     <li>CSRF 비활성화</li>
     *     <li>세션 Stateless 설정</li>
     *     <li>401 Unauthorized 커스텀 처리</li>
     *     <li>OAuth2 로그인 설정</li>
     *     <li>JWT 필터 등록</li>
     * </ul>
     *
     * @param http HttpSecurity 객체
     * @return SecurityFilterChain 보안 필터 체인
     * @throws Exception 보안 설정 중 오류 발생 시
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        boolean isLocalOrDev = env.acceptsProfiles(Profiles.of("local", "dev"));

        // CSRF JWT 헤더 방식이므로 비활성화 (프론트와 API 서버 분리 시 일반적)
        // 추후 쿠키 인증 방식 도입 시 CSRF 토큰 전략 도입 고려
        http
                /* CSRF 비활성화: JWT를 사용할 경우 항상 꺼야 함 */
                .csrf(AbstractHttpConfigurer::disable)
                /* 세션 정책: 무상태(stateless)로 설정 (JWT 기반 인증) / 세션 저장 안 함 (JWT 기반 무상태 인증) (Spring Security 세션 저장 금지) */
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                /* 예외 핸들링 설정 → 401, 403 명확하게 커스터마이징 가능 / 로그인 정보 없을 때, /login 으로 redirect 시키는 것 막기 (401오류로 대체) */
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) ->
                                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"))
                        /* 403 JSON 응답 */
                        .accessDeniedHandler((req, res, ex) -> res.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden"))
                )
                /* 경로 권한 설정 */
                .authorizeHttpRequests(auth -> {
                    // 항상 허용: 인증/리프레시 & 헬스/인포
                    auth.requestMatchers(
                            "/api/auth/**",
                            "/actuator/health/**",
                            "/actuator/info"
                    ).permitAll();

                    // 로컬/개발에서만 허용: H2/Swagger
                    if (isLocalOrDev) {
                        auth.requestMatchers(
                                "/uploads/**",
                                "/h2-console/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll();
                    }
                    /* /api/auth/** 같은 인증 제외 경로는 permitAll() */
                    auth.anyRequest().authenticated();
                })
                /* H2 Console iframe 허용 (local에서만 활성화) */
                .headers(headers -> {
                    //  iframe을 막는 보안 설정 (해제 시 클릭 재킹 위험 있음)
                    // H2 콘솔 iframe 허용 → env 사용안 할 경우 배포 시 제거
                    if (isLocalProfile()) {
                        headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin); // local 일 때만 iframe 허용
                    }
                })
                /* OAuth2 로그인 설정 */
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService) // 사용자 정보 가공 (Google은 불필요, Naver/Kakao 필수)
                        )
                        .successHandler(oAuth2LoginSuccessHandler)   // 로그인 성공 처리
                        .failureHandler(oAuth2LoginFailureHandler)   // 로그인 실패 처리
                )
                /* JWT 필터 등록 (기본 UsernamePasswordAuthenticationFilter보다 앞에 위치) jwtAuthenticationFilter를 UsernamePasswordAuthenticationFilter보다 먼저 실행되도록 등록 */
                // JWT 필터 등록 (기본 UsernamePasswordAuthenticationFilter 앞에 위치)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
                /* UsernamePasswordAuthenticationFilter는 스프링 시큐리티에서 로그인 처리를 담당하는 기본 필터 (아이디 + 비밀번호로 로그인 시도하는 요청을 처리하는 필터) 제일 마지막에 배치 */

        return http.build();
    }

    /**
     * 현재 활성화된 프로파일이 'local'인지 여부를 확인합니다.
     *
     * @return true: local 프로파일이 활성화된 경우, false: 그 외의 경우
     */
    private boolean isLocalProfile() {
        return Arrays.asList(env.getActiveProfiles()).contains("local");
    }


    /**
     * 비밀번호 인코더 빈을 등록합니다.
     *
     * <p>BCrypt를 사용하여 비밀번호를 암호화합니다.
     *
     * @return BCryptPasswordEncoder 인스턴스
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
