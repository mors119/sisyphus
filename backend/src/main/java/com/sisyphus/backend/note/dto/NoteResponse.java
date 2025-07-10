package com.sisyphus.backend.note.dto;


import com.sisyphus.backend.note.entity.Note;
import com.sisyphus.backend.category.dto.CategorySummary;
import com.sisyphus.backend.tag.dto.TagResponse;
import com.sisyphus.backend.tag.entity.Tag;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NoteResponse {
    private Long id;
    private String title;
    private String subTitle;
    private String description;
    private List<TagResponse> tags;
    private LocalDateTime createdAt;
    private CategorySummary category;

    public static NoteResponse fromEntity(Note note) {
        CategorySummary categorySummary = null;
        if (note.getCategory() != null) {
            categorySummary = new CategorySummary(
                    note.getCategory().getId(),
                    note.getCategory().getTitle(),
                    note.getCategory().getColor()
            );
        }

        List<TagResponse> tagSummaries = note.getNoteTags().stream()
                .map(noteTag -> {
                    Tag tag = noteTag.getTag();
                    return new TagResponse(tag.getId(), tag.getName());
                })
                .toList();


        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getSubTitle(),
                note.getDescription(),
                tagSummaries,
                note.getCreatedAt(),
                categorySummary
        );
    }
}


