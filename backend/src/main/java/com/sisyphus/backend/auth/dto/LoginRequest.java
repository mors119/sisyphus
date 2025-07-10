package com.sisyphus.backend.auth.dto;

import com.sisyphus.backend.user.util.Provider;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

// 로그인 요청
@Getter
@AllArgsConstructor
@ToString(exclude = "password") // password를 출력 대상에서 제외
public class LoginRequest {

    @NotBlank(message = "{auth.email.blank}")
    @Email(message = "{auth.email.invalid}")
    private String email;

    @NotBlank(message = "{auth.password.blank}")
    private String password;

    private Provider provider;
}
