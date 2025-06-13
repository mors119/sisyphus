package com.sisyphus.backend.__name__.dto;

import com.sisyphus.backend.__name__.entity.__Name__;
import lombok.Builder;
import lombok.Getter;

// 응답 DTO
@Getter
@Builder
public class __Name__Response {
    private Long id;
    private String title;
    private String description;
}