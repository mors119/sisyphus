package com.sisyphus.backend.require.dto;

import com.sisyphus.backend.require.util.RequireStatus;
import com.sisyphus.backend.require.util.RequireType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(
        name = "RequireResponse",
        description = "요구사항(Require) 응답 DTO"
)
public class RequireResponse {

    @Schema(description = "요구사항 ID", example = "100")
    private Long id;

    @Schema(description = "요구사항 타입", example = "FEATURE")
    private RequireType requireType;

    @Schema(description = "요구사항 제목", example = "태그 드래그 앤 드롭 정렬 기능")
    private String title;

    @Schema(description = "요구사항 작성자 이메일", example = "learner@example.com")
    private String userEmail;

    @Schema(description = "요구사항 설명", example = "태그를 드래그해서 순서를 변경할 수 있도록 구현합니다.")
    private String description;

    @Schema(description = "요구사항 상태", example = "IN_PROGRESS")
    private RequireStatus status;

    @Schema(description = "생성 시각", example = "2025-12-20T05:10:30")
    private LocalDateTime createdAt;

    @Schema(description = "수정 시각", example = "2025-12-20T06:20:10")
    private LocalDateTime updatedAt;
}
