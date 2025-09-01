package com.sisyphus.backend.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.Duration;

// CORS 관련 설정
@Configuration
@RequiredArgsConstructor
//@ConditionalOnProperty(name = "file.static-enabled", havingValue = "true")
public class WebConfig implements WebMvcConfigurer {

    private final AppProps appProps;


    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // TODO: 실제 배포 도메인으로 변경
                .allowedOrigins(appProps.cors().allowedOrigins().toArray(String[]::new))
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
        // TODO: allowCredentials(true) 사용 시 주의 (XSS + 쿠키 조합 위험성), 필요하지 않다면 배포 시 false로 변경
    }

    // Nginx가 서빙하므로 직접 할 필요 없음.
    private final FileProps fileProps; // @ConfigurationProperties(prefix="file")

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        if (fileProps.staticEnabled()) { // ture false로 끄고 켜도록
            registry.addResourceHandler(fileProps.accessUrlPrefix() + "**")
                    .addResourceLocations("file:" + fileProps.uploadDir() + "/")
                    .setCacheControl(
                            CacheControl.maxAge(Duration.ofDays(30)).cachePublic()
                    );
        }
    }


}