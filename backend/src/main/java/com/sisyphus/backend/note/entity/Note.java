package com.sisyphus.backend.note.entity;

import com.sisyphus.backend.note.util.NoteCategory;
import com.sisyphus.backend.tag.entity.Tag;
import com.sisyphus.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Entity
public class Note {

    @Id @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "sub_title")
    private String subTitle;

    @Lob
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NoteCategory category;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id")
    private Tag tag;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 마지막 업데이트 시각
    private LocalDateTime updatedAt;

    @PrePersist
    protected void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // 생성 팩토리 메서드
    public static Note of(String title, String subTitle, String description, Tag tag, NoteCategory category, User user) {
        Note note = new Note();
        note.title = title;
        note.subTitle = subTitle;
        note.description = description;
        note.tag = tag;
        note.category = category;
        note.user = user;
        return note;
    }

    // 명시적 update 메서드
    public void updateNote(String title, String subTitle, String description,Tag tag, NoteCategory category) {
        this.title = title;
        this.subTitle = subTitle;
        this.description = description;
        this.tag = tag;
        this.category = category;
    }

    // 필요하면 Tag 변경도 별도 메서드로 관리
    public void changeTag(Tag tag) {
        this.tag = tag;
    }

}
/*
CREATE TABLE note (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    sub_title VARCHAR(255),
    description TEXT,
    category VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL,
    tag_id BIGINT,
    user_id BIGINT NOT NULL,

    CONSTRAINT fk_note_tag
      FOREIGN KEY (tag_id) REFERENCES tag(id)
      ON DELETE SET NULL,

    CONSTRAINT fk_note_user
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE
)
 */