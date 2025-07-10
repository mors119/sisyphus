package com.sisyphus.backend.note.dto;

import com.sisyphus.backend.tag.entity.Tag;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

//  단어 등록 요청 DTO
@Getter
@Setter
public class NoteRequest {
    private String title;
    private String subTitle;
    private String description;
    private List<Tag> tags;
    private Long categoryId;
}
