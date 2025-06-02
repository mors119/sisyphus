package com.sisyphus.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

// JWT 토큰 응답
@Getter
@AllArgsConstructor
@ToString(exclude = "accessToken")
public class TokenResponse {
    private String accessToken;
}
