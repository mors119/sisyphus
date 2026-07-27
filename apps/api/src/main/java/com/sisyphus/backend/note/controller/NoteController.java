package com.sisyphus.backend.note.controller;


import com.sisyphus.backend.security.principal.UserPrincipal;
import com.sisyphus.backend.global.dto.PageResponse;
import com.sisyphus.backend.note.dto.NoteRequest;
import com.sisyphus.backend.note.dto.NoteResponse;
import com.sisyphus.backend.note.service.NoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Note", description = "노트(Note) CRUD 및 조회 API")
@RestController
@RequestMapping("/api/note")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @Operation(
            summary = "노트 생성",
            description = "현재 로그인한 사용자의 노트를 생성합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/create")
    public ResponseEntity<Long> createNote(
            @RequestBody @Valid NoteRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal.getId();

        Long noteId = noteService.createNote(request, userId);

        // 201 Created + 생성된 리소스 id 반환
        return ResponseEntity.status(HttpStatus.CREATED).body(noteId);
    }

    @Operation(
            summary = "노트 목록 조회(필터/페이지)",
            description = """
                현재 로그인한 사용자의 노트를 페이지로 조회합니다.
                categoryId/tagId/title을 사용해 선택적으로 필터링할 수 있습니다.
                sort 예: createdAt,desc
                """
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/read/all")
    public ResponseEntity<PageResponse<NoteResponse>> readAllNotes(
            @Parameter(description = "페이지(0부터)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "사이즈", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "정렬(필드,방향). 예: createdAt,desc", example = "createdAt,desc")
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            @Parameter(description = "카테고리 ID(선택)", example = "3")
            @RequestParam(required = false) Long categoryId,
            @Parameter(description = "태그 ID(선택)", example = "12")
            @RequestParam(required = false) Long tagId,
            @Parameter(description = "제목 검색(선택)", example = "drag")
            @RequestParam(required = false) String title,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal.getId();
        PageResponse<NoteResponse> notes =
                noteService.readAllWithOptionalFilters(userId, categoryId, tagId, title, page, size, sort);

        return ResponseEntity.ok(notes);
    }

    @Operation(
            summary = "노트 단건 조회",
            description = "노트 ID로 단건 조회합니다. (본인 소유 노트만 조회 가능)"
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/read/{id}")
    public ResponseEntity<NoteResponse> readNote(
            @Parameter(description = "노트 ID", example = "100")
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal.getId();

        return ResponseEntity.ok(noteService.findNoteByUserId(id, userId));
    }

    @Operation(
            summary = "노트 삭제",
            description = "노트 ID로 삭제합니다. (본인 소유 노트만 삭제 가능)"
    )
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteNote(
            @Parameter(description = "노트 ID", example = "100")
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal.getId();

        // 기존 코드의 exists 체크는 컨트롤러에서 할 수도 있지만,
        // 실무에선 서비스에서 권한+존재 검증 후 예외로 404/403 처리하는 편이 더 일관적임.
        noteService.deleteNote(id, userId);

        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "노트 수정",
            description = "노트 ID로 내용을 수정합니다. (본인 소유 노트만 수정 가능)"
    )
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/update/{id}")
    public ResponseEntity<NoteResponse> updateNote(
            @Parameter(description = "노트 ID", example = "100")
            @PathVariable Long id,
            @RequestBody @Valid NoteRequest noteRequest,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal.getId();
        NoteResponse response = noteService.updateNote(id, userId, noteRequest);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "카테고리 미지정 노트 조회(페이지)",
            description = "현재 로그인한 사용자의 노트 중 category가 null인 노트만 페이지로 조회합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/categoryNull")
    public ResponseEntity<PageResponse<NoteResponse>> categoryNull(
            @Parameter(description = "페이지(0부터)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "사이즈", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal.getId();

        PageResponse<NoteResponse> notes = noteService.findNotesWithoutCategory(userId, page, size);
        return ResponseEntity.ok(notes);
    }

}
