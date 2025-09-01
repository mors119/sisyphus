package com.sisyphus.backend.image.service;

import com.sisyphus.backend.configuration.AppProps;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ImageUrlFactory {
    private final AppProps appProps;

    public String publicUrl(String filename) {
        String base = appProps.image().publicBase(); // "/uploads/images" or "https://..."
        if (base.endsWith("/")) base = base.substring(0, base.length()-1);
        return base + "/" + filename;
    }
}
