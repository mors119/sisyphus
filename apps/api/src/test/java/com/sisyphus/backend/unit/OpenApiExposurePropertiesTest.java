package com.sisyphus.backend.unit;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

import static org.assertj.core.api.Assertions.assertThat;

class OpenApiExposurePropertiesTest {

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
            .withInitializer(new ConfigDataApplicationContextInitializer());

    @Test
    void documentationIsEnabledByDefaultForDevelopment() {
        contextRunner.run(context -> {
            assertThat(context.getEnvironment().getProperty("springdoc.api-docs.enabled", Boolean.class))
                    .isTrue();
            assertThat(context.getEnvironment().getProperty("springdoc.swagger-ui.enabled", Boolean.class))
                    .isTrue();
        });
    }

    @Test
    void productionProfileDisablesDocumentationExposure() {
        contextRunner
                .withPropertyValues("spring.profiles.active=prod")
                .run(context -> {
                    assertThat(context.getEnvironment().getProperty("springdoc.api-docs.enabled", Boolean.class))
                            .isFalse();
                    assertThat(context.getEnvironment().getProperty("springdoc.swagger-ui.enabled", Boolean.class))
                            .isFalse();
                });
    }
}
