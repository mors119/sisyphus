package com.sisyphus.backend.word.entity;

import com.sisyphus.backend.example.entity.Example;
import com.sisyphus.backend.tag.entity.Tag;
import com.sisyphus.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Entity
@Table(name = "words")
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "word_text", nullable = false)
    private String wordText;

    @Column(columnDefinition = "TEXT")
    private String meaning;

    @Column(nullable = false)
    private String source;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "word", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Example> examples;

    @ManyToMany
    @JoinTable(
            name = "word_tag",
            joinColumns = @JoinColumn(name = "word_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags;


    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // 상태 변경도 메서드로만
    public void update(String wordText, String meaning, String source) {
        this.wordText = wordText;
        this.meaning = meaning;
        this.source = source;
    }

    // 새로운 단어 추가
    public Word(User user, String wordText, String meaning, String source) {
        this.user = user;
        this.wordText = wordText;
        this.meaning = meaning;
        this.source = source;
    }
}
