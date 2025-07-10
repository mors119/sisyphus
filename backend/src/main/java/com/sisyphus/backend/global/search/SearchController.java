package com.sisyphus.backend.global.search;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;


    @GetMapping
    public List<SearchResponse> search(
            @RequestParam("q") String keyword,
            @PageableDefault(size = 5) Pageable pageable,
            HttpServletRequest request
    ) {
        return searchService.search(keyword, request, pageable);
    }
}