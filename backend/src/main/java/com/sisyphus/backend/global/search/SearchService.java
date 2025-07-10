package com.sisyphus.backend.global.search;

import com.sisyphus.backend.auth.jwt.JwtTokenProvider;
import com.sisyphus.backend.category.repository.CategoryRepository;
import com.sisyphus.backend.note.repository.NoteRepository;
import com.sisyphus.backend.tag.repository.TagRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final JwtTokenProvider jwtTokenProvider;
    private final NoteRepository noteRepository;
    private final TagRepository tagRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<SearchResponse> search(String keyword, HttpServletRequest request, Pageable pageable) {
        String token = jwtTokenProvider.resolveToken(request);

        if(token == null|| !jwtTokenProvider.validateToken(token)) {
            return null;
        }

        Long userId = jwtTokenProvider.getUserId(token);

        List<SearchResponse> tags = tagRepository
                .searchByKeyword(keyword, userId, pageable)
                .stream()
                .map(SearchResponse::from)
                .toList();

        List<SearchResponse> categories = categoryRepository
                .searchByKeyword(keyword, userId, pageable)
                .stream()
                .map(SearchResponse::from)
                .toList();

        List<SearchResponse> notes = noteRepository
                .searchByKeyword(keyword, userId, pageable)
                .stream()
                .map(SearchResponse::from)
                .toList();

        return Stream.of(tags, categories, notes)
                .flatMap(List::stream)
                .sorted(Comparator.comparing(SearchResponse::getTitle, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }
}