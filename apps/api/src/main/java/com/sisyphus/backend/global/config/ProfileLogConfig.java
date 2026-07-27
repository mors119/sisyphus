package com.sisyphus.backend.global.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.core.env.Environment;

@RequiredArgsConstructor
@Configuration
@Slf4j
public class ProfileLogConfig {
    private final Environment env;

    @EventListener(ApplicationReadyEvent.class)
    public void logProfiles() {
        log.info("Active profiles: {}", String.join(",", env.getActiveProfiles()));
    }
}