package com.sisyphus.backend.note.entity;

import com.sisyphus.backend.category.entity.Category;
import com.sisyphus.backend.note.tag.entity.NoteTag;
import com.sisyphus.backend.tag.entity.Tag;
import com.sisyphus.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime updatedAt;

    /* orphanRemoval = true → 컬렉션에서 빠진 NoteTag 는 flush 시 DELETE */
    @OneToMany(mappedBy = "note",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private final Set<NoteTag> noteTags = new HashSet<>();

    /* ---------- JPA 라이프사이클 ---------- */
    @PrePersist
    private void prePersist() { this.createdAt = LocalDateTime.now(); }

    @PreUpdate
    private void preUpdate() { this.updatedAt = LocalDateTime.now(); }

    /* ---------- 팩터리 & 업데이트 ---------- */
    public static Note of(String title, String sub, String desc,
                          Category cat, User user) {
        Note n = new Note();
        n.title = title;
        n.subTitle = sub;
        n.description = desc;
        n.category = cat;
        n.user = user;
        return n;
    }

    public void updateNote(String title, String sub, String desc,
                           Category cat) {
        this.title = title;
        this.subTitle = sub;
        this.description = desc;
        this.category = cat;
    }

    /* ---------- 태그 관리 ---------- */
    /** 중복 체크 후 NoteTag 생성 */
    public void addTag(Tag tag) {
        boolean exists = noteTags.stream()
                .anyMatch(nt -> nt.getTag().equals(tag));
        if (!exists) {
            NoteTag nt = new NoteTag(this, tag);
            noteTags.add(nt);
            tag.getNoteTags().add(nt);      // 양방향 동기화
        }
    }

    /** 모든 태그 관계 제거 → flush 시 NoteTag DELETE */
    public void clearTags() {
        for (NoteTag nt : new HashSet<>(noteTags)) { // 복사본 순회로 CME 방지
            nt.unlink();  // 양방향 컬렉션에서 제거
        }
        noteTags.clear(); // 현재 컬렉션 비우기
    }
}