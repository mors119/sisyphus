package com.sisyphus.backend.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString(exclude = {"code", "codeVerifier"})
@Schema(name = "ExtensionTokenExchangeRequest", description = "Single-use Chrome extension OAuth code exchange")
public class ExtensionTokenExchangeRequest {

    @Schema(description = "Short-lived authorization code", example = "single-use-code")
    @NotBlank
    private String code;

    @Schema(
            description = "S256 PKCE verifier",
            example = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG",
            accessMode = Schema.AccessMode.WRITE_ONLY
    )
    @NotBlank
    private String codeVerifier;

    @Schema(
            description = "Registered chrome.identity redirect URI",
            example = "https://extension-id.chromiumapp.org"
    )
    @NotBlank
    private String redirectUri;
}
