package com.sisyphus.backend.user.dto;

import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.util.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Schema(
        name = "UserResponse",
        description = "유저 기본 정보 응답 DTO"
)
public class UserResponse {

    @Schema(description = "유저 ID", example = "1")
    private final Long id;

    @Schema(description = "이메일", example = "learner@example.com")
    private final String email;

    @Schema(description = "유저 이름", example = "Sisyphus")
    private final String name;

    @Schema(description = "아바타 URL 또는 경로", example = "/uploads/images/avatar.webp")
    private final String avatar;

    @Schema(description = "권한(Role)", example = "USER")
    private final Role role;

    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.avatar = user.getAvatar();
        this.role = user.getRole();
    }
}
