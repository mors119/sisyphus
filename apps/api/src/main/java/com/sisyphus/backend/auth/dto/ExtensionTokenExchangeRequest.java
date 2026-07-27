package com.sisyphus.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString(exclude = {"code", "codeVerifier"})
public class ExtensionTokenExchangeRequest {

    @NotBlank
    private String code;

    @NotBlank
    private String codeVerifier;

    @NotBlank
    private String redirectUri;
}
