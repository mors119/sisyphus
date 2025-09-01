package com.sisyphus.backend.note.controller;


import com.sisyphus.backend.auth.jwt.JwtTokenHandler;
import com.sisyphus.backend.auth.jwt.JwtTokenProvider;
import com.sisyphus.backend.global.dto.PageResponse;
import com.sisyphus.backend.note.dto.NoteRequest;
import com.sisyphus.backend.note.dto.NoteResponse;
import com.sisyphus.backend.note.entity.Note;
import com.sisyphus.backend.note.service.NoteService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/note")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtTokenHandler jwtTokenHandler;

    @PostMapping("/create")
    public ResponseEntity<String> createNote(
            @RequestBody @Valid NoteRequest request,
            HttpServletRequest httpServletRequest
    ) {
        Long userId = jwtTokenHandler.extractUserIdFromRequest(httpServletRequest);

//        소프트 삭제(soft delete)와 하드 삭제(hard delete) 설계 방법

        String response = noteService.createNote(request, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/read/all")
    public ResponseEntity<PageResponse<NoteResponse>> readAllNotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long tagId,
            @RequestParam(required = false) String title,
            HttpServletRequest request
    ) {
        Long userId = jwtTokenHandler.extractUserIdFromRequest(request);

        PageResponse<NoteResponse> notes = noteService.readAllWithOptionalFilters(userId, categoryId, tagId, title, page, size, sort);

        return ResponseEntity.ok(notes);
    }

    @GetMapping("/read/{id}")
    public ResponseEntity<NoteResponse> readNote(@PathVariable Long id, HttpServletRequest request) {
        Long userId = jwtTokenHandler.extractUserIdFromRequest(request);

        Note note = noteService.findNoteByUserId(id, userId);
        return ResponseEntity.ok(NoteResponse.fromEntity(note));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteNote(@PathVariable Long id, HttpServletRequest request) {
        if (!noteService.existsNote(id)) {
            return ResponseEntity.notFound().build();
        }
        Long userId = jwtTokenHandler.extractUserIdFromRequest(request);

        noteService.deleteNote(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<NoteResponse> updateNote(@PathVariable Long id, @RequestBody NoteRequest noteRequest, HttpServletRequest request) {
        Long userId = jwtTokenHandler.extractUserIdFromRequest(request);

        NoteResponse response = noteService.updateNote(id, userId, noteRequest);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/categoryNull")
    public ResponseEntity<PageResponse<NoteResponse>> categoryNull(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request
    ) {
        Long userId = jwtTokenHandler.extractUserIdFromRequest(request);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        PageResponse<NoteResponse> notes = noteService.findNotesWithoutCategory(userId, pageable);
        return ResponseEntity.ok(notes);
    }


}
