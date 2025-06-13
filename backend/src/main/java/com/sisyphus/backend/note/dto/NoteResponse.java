package com.sisyphus.backend.note.dto;


import com.sisyphus.backend.note.entity.Note;
import com.sisyphus.backend.note.util.NoteCategory;
import com.sisyphus.backend.tag.dto.TagSummary;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NoteResponse {
    private Long id;
    private String title;
    private String subTitle;
    private String description;
    private NoteCategory category;
    private LocalDateTime createdAt;
    private TagSummary tag; // tag 요약 정보

    public static NoteResponse fromEntity(Note note) {
        TagSummary tagSummary = null;
        if (note.getTag() != null) {
            tagSummary = new TagSummary(
                    note.getTag().getId(),
                    note.getTag().getTitle(),
                    note.getTag().getColor()
            );
        }

        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getSubTitle(),
                note.getDescription(),
                note.getCategory(),
                note.getCreatedAt(),
                tagSummary
        );
    }
}


