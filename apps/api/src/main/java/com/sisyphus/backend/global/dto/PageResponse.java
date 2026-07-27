package com.sisyphus.backend.global.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.domain.Page;
import java.util.List;

@Schema(name = "PageResponse", description = "Zero-based paginated response")
public record PageResponse<T>(
        @Schema(description = "Items on the current page")
        List<T> content,

        @Schema(description = "Zero-based page number", example = "0")
        int page,           // 0-based

        @Schema(description = "Requested page size", example = "10")
        int size,

        @Schema(description = "Total number of matching items", example = "24")
        long totalElements,

        @Schema(description = "Total number of pages", example = "3")
        int totalPages,

        @Schema(description = "Whether this is the first page", example = "true")
        boolean first,

        @Schema(description = "Whether this is the last page", example = "false")
        boolean last
) {
    public static <T> PageResponse<T> of(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }
}
