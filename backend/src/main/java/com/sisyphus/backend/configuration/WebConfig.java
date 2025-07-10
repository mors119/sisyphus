package com.sisyphus.backend.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// CORS 관련 설정
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // TODO: 실제 배포 도메인으로 변경
                .allowedOrigins(frontendUrl,
                        "http://localhost:3000",
                        "chrome-extension://ndipemmepmlmpoefbpjollgdcddamfbc/")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
        // TODO: allowCredentials(true) 사용 시 주의 (XSS + 쿠키 조합 위험성), 필요하지 않다면 배포 시 false로 변경
    }
}