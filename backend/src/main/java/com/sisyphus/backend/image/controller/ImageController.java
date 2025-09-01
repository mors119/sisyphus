package com.sisyphus.backend.image.controller;

import com.sisyphus.backend.image.dto.ImageUploadResponse;
import com.sisyphus.backend.image.entity.Image;
import com.sisyphus.backend.image.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/image")
public class ImageController {

    private final ImageService imageService;

    @PostMapping
    public ResponseEntity<ImageUploadResponse> upload(@RequestPart("file") MultipartFile file) {
        Image image = imageService.store(file);

        return ResponseEntity.ok(
                new ImageUploadResponse(
                        image.getId(),
                        image.getUrl(),
                        image.getOriginName(),
                        image.getExtension(),
                        image.getSize()
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        imageService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImageUploadResponse> update(
            @PathVariable Long id,
            @RequestPart("file") MultipartFile newFile
    ) {

        Image image = imageService.replace(id, newFile);

        return ResponseEntity.ok(
                new ImageUploadResponse(
                        image.getId(),
                        image.getUrl(),
                        image.getOriginName(),
                        image.getExtension(),
                        image.getSize()
                )
        );
    }

}