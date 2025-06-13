package com.sisyphus.backend.tag.controller;

import com.sisyphus.backend.auth.jwt.JwtTokenProvider;
import com.sisyphus.backend.tag.dto.TagRequest;
import com.sisyphus.backend.tag.dto.TagResponse;
import com.sisyphus.backend.tag.entity.Tag;
import com.sisyphus.backend.tag.service.TagService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tag")
@RequiredArgsConstructor
public class TagController {

    private final JwtTokenProvider jwtTokenProvider;
    private final TagService tagService;

    @GetMapping("/all")
    public ResponseEntity<List<TagResponse>> getAllTags(HttpServletRequest request) {
        Long userId = jwtTokenProvider.getUserId(jwtTokenProvider.resolveToken(request));
        List<Tag> tags = tagService.getAllTags(userId);
        List<TagResponse> response = tags.stream().map(TagResponse::fromEntity).toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createTag(@RequestBody TagRequest tag, HttpServletRequest request) {
        Long userId = jwtTokenProvider.getUserId(jwtTokenProvider.resolveToken(request));
        tagService.createTag(tag, userId);
        return ResponseEntity.ok().build(); // status(201).build()
    }

//    TODO 1: tag delete 시에 노트를 어떻게 처리할 것인가
//    1. note의 tag 값은 비우기 또는 2.note도 삭제, 3. 하위 태그 parentId 비우기 또는 4.. 하위 태그도 삭제

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        try {
            tagService.deleteTag(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updateTag(
            @PathVariable Long id,
            @RequestBody TagRequest request,
            HttpServletRequest httpRequest
    ) {
        Long userId = jwtTokenProvider.getUserId(jwtTokenProvider.resolveToken(httpRequest));
        tagService.updateTag(id, request, userId);
        return ResponseEntity.ok().build();
    }

}
