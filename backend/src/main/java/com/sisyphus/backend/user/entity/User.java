package com.sisyphus.backend.user.entity;

import com.sisyphus.backend.tag.entity.Tag;
import com.sisyphus.backend.note.entity.Note;
import com.sisyphus.backend.user.util.Role;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    private String name;

    private String avatar;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER; // 기본은 일반 사용자

    //  cascade = CascadeType.ALL: 유저 삭제 시 관련된 객체까지 삭제됨
    //	orphanRemoval = true: 유저와의 연결이 끊어진 계정도 삭제됨
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Note> notes = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tag> tags = new ArrayList<>();

    protected User() {} // JPA 필수 기본 생성자

    //  User 클래스의 필드에 파라미터 값 넣기
    public User(String email, String name, Role role) {
        this.email = email;
        this.name = name;
        this.role = role;
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Account> accounts = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }


}
/*
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    avatar VARCHAR(255),
    created_at DATETIME NOT NULL
)

// 유저 삭제 시 연관 노트도 삭제
ALTER TABLE note
ADD CONSTRAINT fk_note_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE
*/