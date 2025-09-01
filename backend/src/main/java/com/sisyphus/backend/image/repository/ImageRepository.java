package com.sisyphus.backend.image.repository;

import com.sisyphus.backend.image.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

    List<Image> findAllByDeletedAtBefore(LocalDateTime time);
}
