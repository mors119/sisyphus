package com.sisyphus.backend.tag.dto;

import com.sisyphus.backend.tag.entity.Tag;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class TagResponse{
    private Long id;
    private String title;
    private String color;
    private Long parentId;

    public static TagResponse fromEntity(Tag tag) {
        return new TagResponse(
                tag.getId(),
                tag.getTitle(),
                tag.getColor(),
                tag.getParent() != null ? tag.getParent().getId() : null
        );
    }
}