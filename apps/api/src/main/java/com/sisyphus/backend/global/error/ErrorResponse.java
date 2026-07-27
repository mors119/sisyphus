package com.sisyphus.backend.global.error;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.List;

@Schema(name = "ErrorResponse", description = "공통 에러 응답 포맷")
public record ErrorResponse(

        @Schema(description = "HTTP 상태 코드", example = "400")
        int status,

        @Schema(description = "에러 코드(프로젝트 표준)", example = "VALIDATION_ERROR")
        String code,

        @Schema(description = "에러 메시지", example = "요청 값이 올바르지 않습니다.")
        String message,

        @Schema(description = "요청 경로", example = "/api/note/create")
        String path,

        @Schema(description = "에러 발생 시각(UTC)", example = "2025-12-20T00:00:00Z")
        Instant timestamp,

        @Schema(description = "필드별 검증 오류")
        List<FieldError> fieldErrors
) {
    public static ErrorResponse of(int status, String code, String message, String path) {
        return of(status, code, message, path, List.of());
    }

    public static ErrorResponse of(
            int status,
            String code,
            String message,
            String path,
            List<FieldError> fieldErrors
    ) {
        return new ErrorResponse(status, code, message, path, Instant.now(), List.copyOf(fieldErrors));
    }

    public record FieldError(
            @Schema(description = "오류가 발생한 필드", example = "email")
            String field,

            @Schema(description = "필드 검증 오류 메시지", example = "올바른 이메일 형식이어야 합니다.")
            String message
    ) {
    }
}
