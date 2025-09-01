package com.sisyphus.backend.note.dto;


import com.sisyphus.backend.image.dto.ImageResponse;
import com.sisyphus.backend.note.entity.Note;
import com.sisyphus.backend.category.dto.CategorySummary;
import com.sisyphus.backend.tag.dto.TagResponse;
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
    private List<ImageResponse> image;

    public static NoteResponse fromEntity(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getSubTitle(),
                note.getDescription(),
                note.getNoteTags().stream()
                        .map(nt -> TagResponse.fromEntity(nt.getTag()))
                        .toList(),
                note.getCreatedAt(),
                note.getCategory() != null ? CategorySummary.fromEntity(note.getCategory()) : null,
                note.getImages().stream()
                        .map(ImageResponse::fromEntity)
                        .toList()
        );
    }


}


