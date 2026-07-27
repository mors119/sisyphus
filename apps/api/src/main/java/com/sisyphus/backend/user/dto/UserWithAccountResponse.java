package com.sisyphus.backend.user.dto;

import com.sisyphus.backend.user.util.Provider;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(
        name = "UserWithAccountResponse",
        description = "유저 상세 정보 + 연결된 OAuth 계정 정보 응답 DTO"
)
public record UserWithAccountResponse(

        @Schema(description = "유저 ID", example = "1")
        Long userId,

        @Schema(description = "유저 이메일", example = "learner@example.com")
        String userEmail,

        @Schema(description = "유저 이름", example = "Sisyphus")
        String userName,

        @Schema(description = "계정 생성 시각(서버 기준)", example = "2025-12-20T05:10:30")
        LocalDateTime createdAt,

        @Schema(description = "연결된 OAuth 계정 목록")
        List<AccountInfo> accounts
) {
    @Schema(
            name = "UserWithAccountResponse.AccountInfo",
            description = "연결된 OAuth 계정 정보"
    )
    public record AccountInfo(

            @Schema(description = "계정 ID", example = "10")
            Long accountId,

            @Schema(description = "해당 OAuth 계정 이메일(제공자에서 전달되는 값)", example = "oauth-user@example.com")
            String email,

            @Schema(description = "OAuth 제공자", example = "GOOGLE")
            Provider provider
    ) {}
}
