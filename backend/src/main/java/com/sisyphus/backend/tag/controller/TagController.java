package com.sisyphus.backend.tag.controller;

import com.sisyphus.backend.auth.jwt.JwtTokenHandler;
import com.sisyphus.backend.tag.dto.TagRequest;
import com.sisyphus.backend.tag.dto.TagResponse;
import com.sisyphus.backend.tag.entity.Tag;
import com.sisyphus.backend.tag.service.TagService;
import com.sisyphus.backend.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tag")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;
    private final JwtTokenHandler jwtTokenHandler;

    @GetMapping
    public ResponseEntity<List<TagResponse>> list(HttpServletRequest request) {
        Long userId = jwtTokenHandler.extractUserIdFromRequest(request);

        List<TagResponse> responses = tagService.list(userId).stream()
                .map(t -> new TagResponse(t.getId(), t.getName()))
                .toList();

        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public  ResponseEntity<String> create(HttpServletRequest request, @RequestBody List<TagRequest> tagRequests) {
        Long userId = jwtTokenHandler.extractUserIdFromRequest(request);

        tagService.getOrCreate(tagRequests, userId);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/update")
    public  ResponseEntity<TagResponse> update(
                              @RequestBody TagRequest dto, HttpServletRequest request) {
        Long userId = jwtTokenHandler.extractUserIdFromRequest(request);

        Tag t = tagService.update(dto.getId(), dto.getName(), userId);
        return ResponseEntity.ok(new TagResponse(t.getId(), t.getName()));
    }

    @DeleteMapping
    public  ResponseEntity<Void> delete(@RequestBody List<Long> tagIds, HttpServletRequest request) {
        Long userId = jwtTokenHandler.extractUserIdFromRequest(request);

        tagService.delete(tagIds, userId);

        return ResponseEntity.noContent().build();
    }


}
