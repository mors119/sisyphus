package com.sisyphus.backend.image.service;

import com.sisyphus.backend.image.entity.Image;
import com.sisyphus.backend.image.entity.NoteImage;
import com.sisyphus.backend.image.repository.ImageRepository;
import com.sisyphus.backend.image.service.storage.FileStorageService;
import com.sisyphus.backend.note.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;
    private final FileStorageService fileStorageService; // 로컬 or S3

    @Transactional
    public Image store(MultipartFile file) {

        String originName = file.getOriginalFilename();
        String extension = extractExtension(Objects.requireNonNull(originName));
        long size = file.getSize();

        // 실제 파일 저장 (로컬 or S3)
        String savedPath = fileStorageService.save(file);

        Image image = new NoteImage(savedPath, originName, extension, size);
        return imageRepository.save(image);
    }

    private String extractExtension(String originName) {
        return originName.substring(originName.lastIndexOf('.') + 1).toLowerCase();
    }

    @Transactional
    public void delete(Long id) {
        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new NoteService.NotFoundException("이미지 없음"));

        fileStorageService.delete(image.getUrl()); // 로컬 or S3
        imageRepository.delete(image);
    }

    @Transactional
    public Image replace(Long id, MultipartFile newFile) {
        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new NoteService.NotFoundException("기존 이미지 없음"));

        // 기존 이미지 삭제 예약
        image.markDeleted(); // ← 여기서 7일 뒤 시간으로 설정

        // 새 이미지 저장
        String saved = fileStorageService.save(newFile);

        image.update(saved,
                newFile.getOriginalFilename(),
                extractExtension(Objects.requireNonNull(newFile.getOriginalFilename())),
                newFile.getSize());

        return image;
    }

    @Transactional(readOnly = true)
    public List<Image> getAllImages() {
        return imageRepository.findAll();
    }

}
