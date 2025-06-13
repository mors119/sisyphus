// src/test/java/com/sisyphus/backend/auth/controller/AuthControllerTest.java

package com.sisyphus.backend.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sisyphus.backend.auth.dto.LoginRequest;
import com.sisyphus.backend.auth.dto.RegisterRequest;
import com.sisyphus.backend.auth.dto.TokenWithRefresh;
import com.sisyphus.backend.auth.jwt.JwtTokenProvider;
import com.sisyphus.backend.auth.service.AuthService;
import com.sisyphus.backend.auth.token.RefreshTokenService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @TestConfiguration
    static class MockServiceConfig {
        @Bean
        public AuthService authService() {
            return mock(AuthService.class);
        }

        @Bean
        public JwtTokenProvider jwtTokenProvider() {
            return mock(JwtTokenProvider.class);
        }

        @Bean
        public RefreshTokenService refreshTokenService() {
            return mock(RefreshTokenService.class);
        }
    }

    @Autowired AuthService authService;
    @Autowired JwtTokenProvider jwtTokenProvider;
    @Autowired
    ObjectMapper objectMapper;

    @Test
    @DisplayName("회원가입 API 테스트")
    void signupTest() throws Exception {
        RegisterRequest request = new RegisterRequest("test@example.com", "1234!", "테스터", "camus");

        when(jwtTokenProvider.createAccessToken(any(), any())).thenReturn("access-token-value");
        when(jwtTokenProvider.createRefreshToken(any())).thenReturn("refresh-token-value");
        when(jwtTokenProvider.createRefreshTokenCookie("refresh-token-value"))
                .thenReturn(ResponseCookie.from("refreshToken", "refresh-token-value").build());

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(header().exists(HttpHeaders.SET_COOKIE))
                .andExpect(jsonPath("$.accessToken").value("access-token-value"))
                .andDo(result -> {
                    System.out.println("✅ [회원가입 응답]");
                    System.out.println(result.getResponse().getContentAsString());
                });
    }

    @Test
    @DisplayName("로그인 API 테스트")
    void loginTest() throws Exception {
        LoginRequest request = new LoginRequest("test@example.com", "1234!", "camus");

        TokenWithRefresh response = new TokenWithRefresh("access-token-value",
                ResponseCookie.from("refreshToken", "refresh-token-value").build());

        when(authService.login(any())).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.SET_COOKIE, response.getRefreshCookie().toString()))
                .andExpect(jsonPath("$.accessToken").value("access-token-value"))
                .andDo(result -> {
                    System.out.println("✅ [로그인 응답]");
                    System.out.println(result.getResponse().getContentAsString());
                });
    }

}
