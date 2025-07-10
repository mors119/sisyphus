package com.sisyphus.backend.category.dto;

import com.sisyphus.backend.category.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CategoryResponse{
    private Long id;
    private String title;
    private String color;

    public static CategoryResponse fromEntity(Category cate) {
        return new CategoryResponse(
                cate.getId(),
                cate.getTitle(),
                cate.getColor()
        );
    }
}