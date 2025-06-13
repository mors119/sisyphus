package com.sisyphus.backend.note.service;


import com.sisyphus.backend.note.dto.NoteRequest;
import com.sisyphus.backend.note.dto.NoteResponse;
import com.sisyphus.backend.note.entity.Note;
import com.sisyphus.backend.note.repository.NoteRepository;
import com.sisyphus.backend.note.util.NoteCategory;
import com.sisyphus.backend.tag.entity.Tag;
import com.sisyphus.backend.tag.repository.TagRepository;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    public class NotFoundException extends RuntimeException {
        public NotFoundException(String message) {
            super(message);
        }
    }

    @Transactional
    public String createNote(NoteRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Tag tag = null;
        if (request.getTagId() != null) {
            tag = tagRepository.findById(request.getTagId())
                    .orElseThrow(() -> new RuntimeException("Tag not found"));
        }


        NoteCategory category = NoteCategory.fromString(request.getCategory());
        Note note = Note.of(request.getTitle(), toNullable(request.getSubTitle()), toNullable(request.getDescription()), tag, category, user);
        noteRepository.save(note);

        return "success";
    }

    public void deleteNote(Long noteId, Long userId) {
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new RuntimeException("단어가 존재하지 않거나 권한이 없습니다."));

        noteRepository.delete(note);
    }

    // notes service
    public Page<Note> readAll(Long userId, Pageable pageable, String categoryStr) {
        NoteCategory category = null;
        if (categoryStr != null && !categoryStr.equalsIgnoreCase("ALL")) {
            try {
                category = NoteCategory.valueOf(categoryStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid category value: " + categoryStr);
            }
        }
        return noteRepository.findAllWithTagByUserIdAndCategory(userId, category, pageable);
    }

    // note id로 note 있는지 확인
    public boolean existsNote(Long noteId) {
        return noteRepository.existsById(noteId);
    }

    // 상세보기
    public Note findNoteWithTagById(Long noteId) {
        return noteRepository.findNoteWithTagById(noteId).orElseThrow(()-> new RuntimeException("Note not found"));
    }

    // 빈 값을 NULL 처리
    public static String toNullable(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }

    @Transactional
    public NoteResponse updateNote(Long noteId, Long userId, NoteRequest noteRequest) {
        // 1. Note 엔티티 조회 (noteId + userId 동시 체크 → 보안 강화)
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new NotFoundException("해당 Note가 없거나 권한이 없습니다."));

        Tag tag = null;
        if (noteRequest.getTagId() != null) {
            tag = tagRepository.findById(noteRequest.getTagId())
                    .orElseThrow(() -> new RuntimeException("Tag not found"));
        }


        // 2. 필드 업데이트
        /* save(note)하지 않아도 JPA는 영속성 컨텍스트에 관리 중인 엔티티의 필드가 변경되면, 트랜잭션 커밋 시점에 자동으로 UPDATE 쿼리를 날린다. */
        note.updateNote(
                noteRequest.getTitle(),
                noteRequest.getSubTitle(),
                noteRequest.getDescription(),
                tag,
                NoteCategory.valueOf(noteRequest.getCategory())
        );

        // 3. 리턴 메시지
        return NoteResponse.fromEntity(note);
    }

    public Page<Note> findNotesWithoutTag(Long userId, NoteCategory category, Pageable pageable) {
        return noteRepository.findNotesWithNullTagByUserAndOptionalCategory(userId, category, pageable);
    }
}
