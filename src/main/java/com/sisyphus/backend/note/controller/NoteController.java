package com.sisyphus.backend.note.controller;


import com.sisyphus.backend.auth.security.UserPrincipal;
import com.sisyphus.backend.note.dto.WordRequest;
import com.sisyphus.backend.note.dto.WordResponse;
import com.sisyphus.backend.note.service.WordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/words")
@RequiredArgsConstructor
public class WordController {

    private final WordService wordService;

    @PostMapping
    public ResponseEntity<WordResponse> createWord(@RequestBody @Valid WordRequest request,
                                                   @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(wordService.createWord(request, user.getId()));
    }

    @GetMapping
    public ResponseEntity<List<WordResponse>> getAllWords(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(wordService.getAllWords(user.getId()));
    }

    @DeleteMapping("/{wordId}")
    public ResponseEntity<Void> deleteWord(@PathVariable Long wordId,
                                           @AuthenticationPrincipal UserPrincipal user) {
        wordService.deleteWord(wordId, user.getId());
        return ResponseEntity.noContent().build();
    }
}
