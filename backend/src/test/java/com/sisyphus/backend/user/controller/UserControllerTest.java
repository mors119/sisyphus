package com.sisyphus.backend.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sisyphus.backend.auth.jwt.JwtTokenProvider;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.service.UserService;
import com.sisyphus.backend.user.util.Role;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static com.sisyphus.backend.auth.jwt.JwtTokenProvider.HEADER_STRING;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired MockMvc mockMvc;

    @TestConfiguration
    static class MockConfig {
        @Bean
        public UserService userService() {
            return mock(UserService.class);
        }

        @Bean
        public JwtTokenProvider jwtTokenProvider() {
            return mock(JwtTokenProvider.class);
        }
    }

    @Autowired UserService userService;
    @Autowired JwtTokenProvider jwtTokenProvider;
    @Autowired ObjectMapper objectMapper;

    @Test
    @DisplayName("정상적인 accessToken으로 유저 정보 조회 성공")
    void readUserInfoSuccess() throws Exception {
        String fakeToken = "access-token-value";
        Long userId = 1L;
        User user = new User("test@example.com", null, Role.USER);

        when(jwtTokenProvider.getUserId(fakeToken)).thenReturn(userId);
        when(userService.findById(userId)).thenReturn(user);

        mockMvc.perform(post("/api/user/read")
                        .header("Authorization", "Bearer " + fakeToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.name").value("테스터"));
    }

    @Test
    @DisplayName("Authorization 헤더 누락 시 예외 발생")
    void noAuthHeader() throws Exception {
        mockMvc.perform(post("/api/user/read"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Authorization 헤더 형식 오류")
    void malformedAuthHeader() throws Exception {
        mockMvc.perform(post("/api/user/read")
                        .header(HEADER_STRING, "InvalidFormat token"))
                .andExpect(status().isUnauthorized());
    }
}
