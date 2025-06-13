package com.sisyphus.backend.note.controller;


import com.sisyphus.backend.auth.jwt.JwtTokenProvider;
import com.sisyphus.backend.note.dto.NoteRequest;
import com.sisyphus.backend.note.dto.NoteResponse;
import com.sisyphus.backend.note.entity.Note;
import com.sisyphus.backend.note.service.NoteService;
import com.sisyphus.backend.note.util.NoteCategory;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/note")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/create")
    public ResponseEntity<String> createNote(
            @RequestBody @Valid NoteRequest request,
            HttpServletRequest httpServletRequest
    ) {
        String token = jwtTokenProvider.resolveToken(httpServletRequest);
        Long userId = jwtTokenProvider.getUserId(token);

        String response = noteService.createNote(request, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/read/all")
    public ResponseEntity<Page<NoteResponse>> readAllNotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            HttpServletRequest request
    ) {
        Long userId = jwtTokenProvider.getUserId(jwtTokenProvider.resolveToken(request));

        String[] parts = sort.split(",");
        String property = parts[0];
        String direction = parts.length > 1 ? parts[1] : "asc";

        System.out.println("orders = " + property + " " + direction);

        Pageable pageable = PageRequest.of(page, size, Sort.by(new Sort.Order(Sort.Direction.fromString(direction.toUpperCase()), property)));
        Page<Note> notes = noteService.readAll(userId, pageable, category);

        return ResponseEntity.ok(notes.map(NoteResponse::fromEntity));
    }


    @GetMapping("/read/{id}")
    public ResponseEntity<NoteResponse> readNote(@PathVariable Long id) {
        Note note = noteService.findNoteWithTagById(id);
        System.out.println("note.getTag().getTitle() = " + note.getTitle());
        return ResponseEntity.ok(NoteResponse.fromEntity(note));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteNote(@PathVariable Long id, HttpServletRequest request) {
        if (!noteService.existsNote(id)) {
            return ResponseEntity.notFound().build();
        }

        Long userId = jwtTokenProvider.getUserId(jwtTokenProvider.resolveToken(request));
        noteService.deleteNote(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<NoteResponse> updateNote(@PathVariable Long id, @RequestBody NoteRequest noteRequest, HttpServletRequest request) {
        Long userId = jwtTokenProvider.getUserId(jwtTokenProvider.resolveToken(request));

        NoteResponse response = noteService.updateNote(id, userId, noteRequest);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/tagNull")
    public ResponseEntity<Page<NoteResponse>> tagNull(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request
    ) {
        Long userId = jwtTokenProvider.getUserId(jwtTokenProvider.resolveToken(request));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        NoteCategory categoryEnum = null;
        if (category != null && !category.isEmpty()) {
            try {
                categoryEnum = NoteCategory.valueOf(category.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        Page<Note> notes = noteService.findNotesWithoutTag(userId, categoryEnum, pageable);
        return ResponseEntity.ok(notes.map(NoteResponse::fromEntity));
    }


}
