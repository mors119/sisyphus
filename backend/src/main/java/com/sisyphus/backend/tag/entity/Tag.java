package com.sisyphus.backend.tag.entity;

import com.sisyphus.backend.note.tag.entity.NoteTag;
import com.sisyphus.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Entity
@Table(name = "tag",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_tag_user", columnNames = {"name","user_id"}))
public class Tag {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User owner;

    /* Tag 측에도 orphanRemoval=true 적용 */
    @OneToMany(mappedBy = "tag",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private final Set<NoteTag> noteTags = new HashSet<>();

    /* ---------- 도메인 로직 ---------- */
    public void changeName(String newName) {
        if (newName == null || newName.isBlank()) {
            throw new IllegalArgumentException("태그 이름은 비어 있을 수 없습니다.");
        }
        this.name = newName.trim().toLowerCase();
    }

    public static Tag of(String name, User owner) {
        Tag t = new Tag();
        t.name  = name.trim().toLowerCase();
        t.owner = owner;
        return t;
    }
}