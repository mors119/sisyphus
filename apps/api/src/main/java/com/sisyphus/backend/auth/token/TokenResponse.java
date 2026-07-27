package com.sisyphus.backend.auth.token;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

// JWT 토큰 응답
@Getter
@AllArgsConstructor
@ToString(exclude = "accessToken")
@Schema(name = "TokenResponse", description = "Short-lived bearer access token response")
public class TokenResponse {
    @Schema(
            description = "JWT bearer token; no default credential is provided",
            example = "<access-token>",
            accessMode = Schema.AccessMode.READ_ONLY
    )
    private String accessToken;
}
