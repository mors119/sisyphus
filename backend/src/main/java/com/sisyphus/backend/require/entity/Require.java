package com.sisyphus.backend.require.entity;

import com.sisyphus.backend.require.util.RequireStatus;
import com.sisyphus.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Require {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 제목
    @Column(nullable = false, length = 100)
    private String title;

    // 본문
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    // 상태
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RequireStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "require", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.status = RequireStatus.RECEIVED;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void updateContent(String title, String description) {
        this.title = title;
        this.description = description;
    }

    // 상태 변경
    public void changeStatus(RequireStatus newStatus) {
        this.status = newStatus;
    }
}
