package com.sisyphus.backend.tag.dto;

import lombok.Data;

@Data
public class TagRequest {
    private String title;
    private String color;
    private Long parentId;
}
