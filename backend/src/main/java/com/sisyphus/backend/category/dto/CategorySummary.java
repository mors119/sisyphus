package com.sisyphus.backend.category.dto;

import com.sisyphus.backend.category.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CategorySummary {
    private Long id;
    private String title;
    private String color;

    public static CategorySummary fromEntity(Category category) {
        return new CategorySummary(
                category.getId(),
                category.getTitle(),
                category.getColor()
        );
    }
}
