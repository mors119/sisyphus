package com.sisyphus.backend.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String email;

    private String name;

    private String provider; // "google", "naver", "camus"

    @Column(name = "password_hash")
    private String passwordHash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public void linkToUser(User user) {
        this.user = user;
    }


    // Local 회원가입용
    public static Account ofLocal(String email, String name, String encodedPassword) {
        Account account = new Account();
        account.email = email;
        account.name = name;
        account.passwordHash = encodedPassword;
        account.provider = "camus";
        return account;
    }

    // OAuth 회원가입용
    public static Account ofOauth(String email, String name, String provider) {
        Account account = new Account();
        account.email = email;
        account.name = name;
        account.provider = provider;
        return account;
    }
}
/*
CREATE TABLE accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    provider VARCHAR(50), -- 예: "google", "naver", "camus"
    password_hash VARCHAR(255),
    user_id BIGINT,
    created_at DATETIME NOT NULL,

    CONSTRAINT fk_account_user
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE
)
*/