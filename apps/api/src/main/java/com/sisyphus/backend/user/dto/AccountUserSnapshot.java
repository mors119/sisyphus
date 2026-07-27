package com.sisyphus.backend.user.dto;

import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.util.Role;

public record AccountUserSnapshot(Long id, String email, Role role) {

    public static AccountUserSnapshot from(User user) {
        return new AccountUserSnapshot(
                user.getId(),
                user.getEmail(),
                user.getRole() == null ? Role.USER : user.getRole()
        );
    }
}
