package com.sisyphus.backend.tag.entity;

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
public class Tag {

    @Id
    @GeneratedValue
    private Long id;

    @Setter
    @Column(nullable = false)
    private String title;

    // 순환참조 방지 (예시: Lombok + Jackson)
    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_tag_id")
    @JsonBackReference
    private Tag parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Tag> children = new ArrayList<>();

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
    public static List<Tag> createDefaultTags(User user) {
        Tag tag1 = new Tag();
        tag1.title = "New";
        tag1.color = "#ffcd49";
        tag1.user = user;

        Tag tag2 = new Tag();
        tag2.title = "Important";
        tag2.color = "#f87171";
        tag2.user = user;

        return List.of(tag1, tag2);
    }

}
/*
CREATE TABLE tag (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    color VARCHAR(7) NOT NULL CHECK (color REGEXP '^#[0-9A-Fa-f]{6}$'),
    parent_tag_id BIGINT,
    user_id BIGINT,

    CONSTRAINT fk_tag_parent
        FOREIGN KEY (parent_tag_id)
        REFERENCES tag(id),

    CONSTRAINT fk_tag_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
)
*/