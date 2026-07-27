package com.sisyphus.backend.image.service;

import com.sisyphus.backend.image.dto.ImageUploadResponse;
import com.sisyphus.backend.image.entity.Image;
import com.sisyphus.backend.image.entity.NoteImage;
import com.sisyphus.backend.image.exception.NotFoundImageException;
import com.sisyphus.backend.image.repository.ImageRepository;
import com.sisyphus.backend.image.service.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;

/**
 * 이미지 도메인 서비스
 *
 * 정책:
 * - store: 저장 후 DB에 public URL 저장
 * - replace: 새 파일 저장 성공 후 기존 파일 즉시 삭제
 * - delete: DB 삭제 후 파일 삭제(실패해도 DB는 제거되어 사용자 영향 최소화)
 */
@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public ImageUploadResponse store(MultipartFile file) {
        // 원본 파일명은 UI표시용(신뢰 X, 하지만 메타로 저장)
        String originName = Objects.requireNonNull(file.getOriginalFilename(), "원본 파일명이 없습니다.");
        String extension = extractExtension(originName);
        long size = file.getSize();

        // 실제 파일 저장 → public URL 반환
        String publicUrl = fileStorageService.save(file);

        Image image = new NoteImage(publicUrl, originName, extension, size);
        return ImageUploadResponse.from(imageRepository.save(image));
    }

    @Transactional
    public void delete(Long id) {
        Image image = imageRepository.findById(id)
                .orElseThrow(NotFoundImageException::new);

        // 삭제용 URL(파일명 추출 대상)
        final String url = image.getUrl();

        // 1) DB 먼저 삭제 (파일 삭제 실패 시에도 사용자 화면에서 참조가 끊김)
        imageRepository.delete(image);

        // 2) 파일 삭제
        fileStorageService.delete(url);
    }

    @Transactional
    public ImageUploadResponse replace(Long id, MultipartFile newFile) {
        Image image = imageRepository.findById(id)
                .orElseThrow(NotFoundImageException::new);

        final String oldUrl = image.getUrl();

        // 새 파일 저장 (public URL)
        final String newUrl = fileStorageService.save(newFile);

        String originName = Objects.requireNonNull(newFile.getOriginalFilename(), "원본 파일명이 없습니다.");
        String extension = extractExtension(originName);
        long size = newFile.getSize();

        // 엔티티 갱신
        image.update(newUrl, originName, extension, size);

        // 기존 파일 삭제 (새 저장 + DB 갱신 성공 이후)
        fileStorageService.delete(oldUrl);

        return ImageUploadResponse.from(image);
    }

    /**
     * @param originName String (역할: 원본 파일명에서 확장자 추출, 타입: String)
     * @return String (역할: 확장자, 타입: String)
     */
    private String extractExtension(String originName) {
        int idx = originName.lastIndexOf('.');
        if (idx < 0 || idx == originName.length() - 1) {
            throw new IllegalArgumentException("확장자가 없는 파일명입니다: " + originName);
        }
        return originName.substring(idx + 1).toLowerCase();
    }
}
