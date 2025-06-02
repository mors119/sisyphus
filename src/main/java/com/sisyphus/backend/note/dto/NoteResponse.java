package com.sisyphus.backend.note.dto;


import com.sisyphus.backend.note.entity.Note;
import lombok.Getter;
import lombok.Setter;

// 단어 응답
@Setter
@Getter
public class WordResponse {
    private Long id;
    private String wordText;
    private String meaning;
    private String source;

    public static WordResponse fromEntity(Note note) {
        WordResponse res = new WordResponse();
        res.setId(note.getId());
        res.setWordText(note.getWordText());
        res.setMeaning(note.getMeaning());
        res.setSource(note.getSource());
        return res;
    }

}
