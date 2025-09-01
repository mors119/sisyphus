package com.sisyphus.backend.configuration;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "file")
public record FileProps(
        @NotBlank String uploadDir,          // 예: /var/www/images/uploads
        String accessUrlPrefix,               // API 스트리밍 쓸 때만; Nginx 정적이면 비워둠
        boolean staticEnabled
) {}