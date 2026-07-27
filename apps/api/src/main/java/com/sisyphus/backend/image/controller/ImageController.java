package com.sisyphus.backend.image.controller;

import com.sisyphus.backend.image.dto.ImageUploadResponse;
import com.sisyphus.backend.image.service.ImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Image", description = "이미지 업로드/수정/삭제 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/image")
public class ImageController {

    private final ImageService imageService;

    @Operation(
            summary = "이미지 업로드",
            description = "multipart/form-data로 파일을 업로드하고 업로드된 이미지 메타데이터를 반환합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageUploadResponse> upload(
            @Parameter(
                    description = "업로드할 이미지 파일",
                    required = true,
                    content = @Content(
                            schema = @Schema(type = "string", format = "binary")
                    )
            )
            @RequestPart("file") MultipartFile file
    ) {
        return ResponseEntity.status(201).body(imageService.store(file));
    }

    @Operation(
            summary = "이미지 삭제",
            description = "이미지 ID를 기준으로 즉시 삭제합니다(DB + 파일)."
    )
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "이미지 ID", example = "1")
            @PathVariable Long id
    ) {
        imageService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "이미지 교체(업데이트)",
            description = "이미지 ID를 기준으로 파일을 새 파일로 교체하고, 교체된 이미지 메타데이터를 반환합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageUploadResponse> update(
            @Parameter(description = "이미지 ID", example = "1")
            @PathVariable Long id,
            @Parameter(
                    description = "새 이미지 파일",
                    required = true,
                    content = @Content(
                            schema = @Schema(type = "string", format = "binary")
                    )
            )
            @RequestPart("file") MultipartFile newFile
    ) {
        return ResponseEntity.ok(imageService.replace(id, newFile));
    }
}
