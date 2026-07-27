package com.sisyphus.backend.unit;

import com.sisyphus.backend.category.entity.Category;
import com.sisyphus.backend.category.repository.CategoryRepository;
import com.sisyphus.backend.note.entity.Note;
import com.sisyphus.backend.note.repository.NoteRepository;
import com.sisyphus.backend.search.dto.SearchResponse;
import com.sisyphus.backend.search.service.SearchService;
import com.sisyphus.backend.tag.entity.Tag;
import com.sisyphus.backend.tag.repository.TagRepository;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.util.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SearchServiceTest {

    @Mock
    NoteRepository noteRepository;

    @Mock
    TagRepository tagRepository;

    @Mock
    CategoryRepository categoryRepository;

    @InjectMocks
    SearchService searchService;

    @Test
    void blankKeywordReturnsEmptyResultWithoutQueries() {
        assertThat(searchService.search("   ", 1L, PageRequest.of(0, 5))).isEmpty();

        verifyNoInteractions(noteRepository, tagRepository, categoryRepository);
    }

    @Test
    void combinesResourceTypesAndSortsTitlesIgnoringCase() {
        User owner = new User("owner@example.com", "Owner", Role.USER);
        Category category = Category.of(owner, "Alpha");
        Tag tag = Tag.of("zulu", owner);
        Note note = Note.of("beta", null, null, null, owner);
        PageRequest page = PageRequest.of(0, 5);

        when(tagRepository.searchByKeyword("term", 1L, page))
                .thenReturn(new PageImpl<>(List.of(tag)));
        when(categoryRepository.searchByKeyword("term", 1L, page))
                .thenReturn(new PageImpl<>(List.of(category)));
        when(noteRepository.searchByKeyword("term", 1L, page))
                .thenReturn(new PageImpl<>(List.of(note)));

        List<SearchResponse> results = searchService.search(" term ", 1L, page);

        assertThat(results).extracting(SearchResponse::getTitle)
                .containsExactly("Alpha", "beta", "zulu");
    }
}
