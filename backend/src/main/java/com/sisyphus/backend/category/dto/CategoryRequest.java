package com.sisyphus.backend.category.dto;

import lombok.Data;

@Data
public class CategoryRequest {
    private String title;
    private String color;
    private Long parentId;
}
