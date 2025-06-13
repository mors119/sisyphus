package com.sisyphus.backend.tag.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class TagSummary {
    private Long id;
    private String title;
    private String color;
}
