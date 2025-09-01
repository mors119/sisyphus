package com.sisyphus.backend.image.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;


@Getter
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "image_type")
@Entity
@NoArgsConstructor
@Where(clause = "deleted_at IS NULL") // deletedAt이 있는 image는 제외
public abstract class Image {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String originName;

    @Column(nullable = false)
    private String extension;

    @Column(nullable = false)
    private Long size;

    @Column(nullable = false)
    private final LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime deletedAt;

    protected Image(String url, String originName, String extension, Long size) {
        this.url = url;
        this.originName = originName;
        this.extension = extension;
        this.size = size;
    }

    public void update(String url, String originName, String extension, Long size) {
        this.url = url;
        this.originName = originName;
        this.extension = extension;
        this.size = size;
    }

    public void markDeleted() {
        this.deletedAt = LocalDateTime.now().plusDays(7);
    }

}
