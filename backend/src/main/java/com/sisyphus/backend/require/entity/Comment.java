//package com.sisyphus.backend.require.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Getter
//@NoArgsConstructor(access = AccessLevel.PROTECTED)
//@AllArgsConstructor
//@Builder
//public class Comment {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    // 작성자
//    private Long userId;
//
//    @Column(nullable = false, columnDefinition = "TEXT")
//    private String content;
//
//    // 연결된 요구사항
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "require_id", nullable = false)
//    private Require require;
//
//    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
//
//    @PrePersist
//    public void onCreate() {
//        this.createdAt = LocalDateTime.now();
//    }
//
//    @PreUpdate
//    public void onUpdate() {
//        this.updatedAt = LocalDateTime.now();
//    }
//
//    // 도메인 메서드
//    public void editContent(String content) {
//        this.content = content;
//    }
//}
