package com.sisyphus.backend.category.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.sisyphus.backend.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(name = "category")
public class Category {

    @Id
    @GeneratedValue
    private Long id;

    @Setter
    @Column(nullable = false)
    private String title;

    // #ffffff 같은 hex 코드만
    @Setter
    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "유효한 HEX 색상코드여야 합니다.")
    @Column(nullable = false)
    private String color;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // 외래 키 컬럼명
    private User user;             // User와의 연관관계 추가

    @PrePersist
    protected void setDefaultColor() {
        if (this.color == null) {
            this.color = "#ffcd49";
        }
    }

    // 정적 메서드: 기본 태그 목록 생성
    public static List<Category> createDefaultCategories(User user) {
        Category cate1 = new Category();
        cate1.title = "New";
        cate1.color = "#ffcd49";
        cate1.user = user;

        Category cate2 = new Category();
        cate2.title = "Important";
        cate2.color = "#f87171";
        cate2.user = user;

        return List.of(cate1, cate2);
    }

}