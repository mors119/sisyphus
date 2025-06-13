package com.sisyphus.backend.auth.token;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FullTokenResponse {
    private String accessToken;
    private String refreshToken;
}