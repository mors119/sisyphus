package com.sisyphus.backend.user.dto;

import com.sisyphus.backend.user.util.Role;
import lombok.Data;

@Data
public class UserRequest {
    private Long id;
    private String email;
    private Role role;
}
