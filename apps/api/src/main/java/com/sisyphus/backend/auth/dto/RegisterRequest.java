package com.sisyphus.backend.auth.dto;

import com.sisyphus.backend.user.util.Provider;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

//  회원가입 요청
@Getter
@AllArgsConstructor
@ToString(exclude = "password")
@Schema(name = "RegisterRequest", description = "Local account registration request")
public class RegisterRequest {

    @Schema(description = "User email address", example = "learner@example.com")
    @NotBlank(message = "{auth.email.blank}")
    @Email(message = "{auth.email.invalid}")
    private String email;

    @Schema(
            description = "Account password",
            example = "example-password",
            accessMode = Schema.AccessMode.WRITE_ONLY
    )
    @NotBlank(message = "{auth.password.blank}")
    private String password;

    @Schema(description = "Account provider", example = "CAMUS")
    private Provider provider;

    @Schema(description = "Display name", example = "Sisyphus")
    private String name;
}
