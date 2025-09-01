package com.sisyphus.backend.require.entity;

import com.sisyphus.backend.require.util.RequireStatus;
import com.sisyphus.backend.require.util.RequireType;
import com.sisyphus.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamicUpdate // 변경된 칼럼만 업데이트 시도하기
public class Require {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING) // 문자열로 저장
    @Column(name = "require_type", nullable = false, length = 32)
    private RequireType requireType;

    // 제목
    @Column(nullable = false, length = 100)
    private String title;

    // 본문
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    // 상태
    @Enumerated(EnumType.STRING) // 문자열로 저장
    @Column(name = "status", nullable = false, length = 32)
    private RequireStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

//    @Builder.Default // Lombok Builder가 초기값을 무시하지 않게
//    @OneToMany(mappedBy = "require", cascade = CascadeType.ALL)
//    private List<Comment> comments = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = RequireStatus.RECEIVED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void updateContent(String title, String description) {
        if (title != null) this.title = title;
        if (description != null) this.description = description;
    }

}
