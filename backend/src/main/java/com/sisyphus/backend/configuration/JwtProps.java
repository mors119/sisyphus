package com.sisyphus.backend.configuration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "jwt")
public record JwtProps(
        @NotBlank String secret,
        @Positive long expiration,
        @Positive long refreshExpiration
) {}