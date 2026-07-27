package com.sisyphus.backend.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(name = "EmailVerifyRequest", description = "Email verification-code check")
public class EmailVerifyRequest {
    @Schema(description = "Email that received the code", example = "learner@example.com")
    private String email;

    @Schema(description = "Short-lived verification code", example = "123456")
    private String code;
}
