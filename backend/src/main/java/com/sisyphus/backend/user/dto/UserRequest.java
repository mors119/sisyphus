package com.sisyphus.backend.user.dto;

import lombok.Data;

@Data
public class UserRequest {
    private Long id;
    private String email;
}
