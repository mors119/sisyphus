package com.sisyphus.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

//  회원가입 요청
@Getter
@AllArgsConstructor
@ToString(exclude = "password")
public class RegisterRequest {

    @NotBlank(message = "{auth.email.blank}")
    @Email(message = "{auth.email.invalid}")
    private String email;

    @NotBlank(message = "{auth.password.blank}")
    private String password;

    private String provider;

    private String name;
}
