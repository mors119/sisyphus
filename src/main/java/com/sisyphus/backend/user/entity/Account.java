package com.sisyphus.backend.user.entity;

import jakarta.persistence.*;

@Entity
public class Account {
    @Id
    @GeneratedValue
    private Long id;

    private String provider;    // "google", "naver", "local"
    private String providerId;  // Google sub, Naver id, username 등

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;
}
