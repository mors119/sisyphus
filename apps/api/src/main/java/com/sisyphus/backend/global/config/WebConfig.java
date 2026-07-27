package com.sisyphus.backend.global.config;

import com.sisyphus.backend.global.props.FileProps;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.Duration;

@Configuration
@RequiredArgsConstructor
//@ConditionalOnProperty(name = "file.static-enabled", havingValue = "true")
public class WebConfig implements WebMvcConfigurer {

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