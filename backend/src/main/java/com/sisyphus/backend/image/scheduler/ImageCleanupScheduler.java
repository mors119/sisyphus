package com.sisyphus.backend.image.scheduler;

import com.sisyphus.backend.image.entity.Image;
import com.sisyphus.backend.image.repository.ImageRepository;
import com.sisyphus.backend.image.service.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Component
public class ImageCleanupScheduler {

    private final ImageRepository imageRepository;
    private final FileStorageService fileStorageService;

    // 매일 새벽 3시 delete 시간이 도과한 image 삭제
    @Scheduled(cron = "0 0 3 * * *") // 초 분 시 일 월 요일
    @Transactional
    public void hardDeleteImages() {
        List<Image> expired = imageRepository.findAllByDeletedAtBefore(LocalDateTime.now());

        for (Image image : expired) {
            try {
                fileStorageService.delete(image.getUrl());
                imageRepository.delete(image); // 실제 DB 하드 삭제
                log.info("Deleted expired image: {}", image.getId());
            } catch (Exception e) {
                log.error("Failed to delete image: {}", image.getId(), e);
            }
        }
    }
}
