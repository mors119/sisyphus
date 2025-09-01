package com.sisyphus.backend.image.service.storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String save(MultipartFile file);
    void delete(String savedUrl);
}