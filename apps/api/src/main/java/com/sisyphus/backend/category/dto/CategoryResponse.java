package com.sisyphus.backend.category.dto;

import com.sisyphus.backend.category.entity.Category;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Schema(name = "CategoryResponse", description = "Category returned to API clients")
public class CategoryResponse{
    @Schema(description = "Category identifier", example = "3")
    private Long id;

    @Schema(description = "Category title", example = "Important")
    private String title;

    @Schema(description = "Six-digit hexadecimal color", example = "#ffcd49")
    private String color;

    public static CategoryResponse fromEntity(Category cate) {
        return new CategoryResponse(
                cate.getId(),
                cate.getTitle(),
                cate.getColor()
        );
    }
}