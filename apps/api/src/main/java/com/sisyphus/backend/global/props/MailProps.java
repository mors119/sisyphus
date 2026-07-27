package com.sisyphus.backend.global.props;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "mail")
public record MailProps(From from) {

    public record From(
            @DefaultValue("no-reply@sisyphus.com") String address,
            @DefaultValue("Sisyphus 인증") String name
    ) {}
}
