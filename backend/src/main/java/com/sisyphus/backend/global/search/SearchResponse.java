package com.sisyphus.backend.global.search;

import com.sisyphus.backend.category.entity.Category;
import com.sisyphus.backend.note.entity.Note;
import com.sisyphus.backend.tag.entity.Tag;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SearchResponse {
    private String type;   // "tag", "category", "note"
    private Long id;
    private String title;

    private SearchResponse(String type, Long id, String title) {
        this.type = type;
        this.id = id;
        this.title = title;
    }

    /* 각 도메인별 변환기 */
    public static SearchResponse from(Tag tag) {
        return new SearchResponse("tag", tag.getId(), tag.getName());
    }

    public static SearchResponse from(Category category) {
        return new SearchResponse("category", category.getId(), category.getTitle());
    }

    public static SearchResponse from(Note note) {
        return new SearchResponse("note", note.getId(), note.getTitle());
    }
}