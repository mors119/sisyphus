package com.sisyphus.backend.note.dto;

import lombok.Getter;
import lombok.Setter;

//  단어 등록 요청 DTO
@Getter
@Setter
public class NoteRequest {
    private String title;
    private String subTitle;
    private String description;
    private Long tagId;
    private String category;
}
