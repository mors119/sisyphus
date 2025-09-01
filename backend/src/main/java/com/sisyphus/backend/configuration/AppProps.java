package com.sisyphus.backend.configuration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Validated
@ConfigurationProperties(prefix = "app")
public record AppProps (
        Hosts hosts,
        Image image,
        Cors cors,
        Upload upload
) {
    public record Hosts (
            @NotBlank String app,
            @NotBlank String api,
            @NotBlank String img,
            @NotBlank String chromeExtension
    ) {}

    public record Image(@NotBlank String publicBase) {}

    public record Cors(@NotEmpty List<@NotBlank String> allowedOrigins) {}

    public record Upload(@NotEmpty List<@Pattern(regexp = "^[a-z0-9]+$") String> allowedExtensions) {}
}
