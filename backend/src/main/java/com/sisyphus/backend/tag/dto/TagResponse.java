package com.sisyphus.backend.tag.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class TagResponse {
    private Long id;
    private String name;
}