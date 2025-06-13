package com.sisyphus.backend.user.dto;


import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.util.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserResponse {
    private final Long id;
    private final String email;
    private final String name;
    private final String avatar;
    private final Role role;

    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.avatar = user.getAvatar();
        this.role = user.getRole();
    }
}