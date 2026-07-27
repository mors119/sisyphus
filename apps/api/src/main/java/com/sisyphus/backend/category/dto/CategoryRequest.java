package com.sisyphus.backend.category.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(name = "CategoryRequest", description = "Category create or update request")
public class CategoryRequest {
    @Schema(description = "Category title", example = "Important")
    private String title;

    @Schema(description = "Six-digit hexadecimal color", example = "#ffcd49")
    private String color;

    @Schema(hidden = true)
    private Long parentId;
}
