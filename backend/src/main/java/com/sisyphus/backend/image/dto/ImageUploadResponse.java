package com.sisyphus.backend.image.dto;

public record ImageUploadResponse(
        Long id,
        String url,
        String originName,
        String extension,
        Long size
) {}