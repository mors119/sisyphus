package com.sisyphus.backend.auth.dto;

import lombok.Getter;
import org.springframework.http.ResponseCookie;

@Getter
public class TokenWithRefresh {
    private final String accessToken;
    private final ResponseCookie refreshCookie;

    public TokenWithRefresh(String accessToken, ResponseCookie refreshCookie) {
        this.accessToken = accessToken;
        this.refreshCookie = refreshCookie;
    }
}