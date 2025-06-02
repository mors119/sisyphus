package com.sisyphus.backend.note.dto;

import lombok.Getter;
import lombok.Setter;

//  단어 등록 요청 DTO
@Getter
@Setter
public class WordRequest {
    private String wordText;
    private String meaning;
    private String source;
}
