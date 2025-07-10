package com.sisyphus.backend.note.service;


import com.sisyphus.backend.category.entity.Category;
import com.sisyphus.backend.category.repository.CategoryRepository;
import com.sisyphus.backend.note.dto.NoteRequest;
import com.sisyphus.backend.note.dto.NoteResponse;
import com.sisyphus.backend.note.entity.Note;
import com.sisyphus.backend.note.repository.NoteRepository;
import com.sisyphus.backend.note.tag.entity.NoteTag;
import com.sisyphus.backend.tag.entity.Tag;
import com.sisyphus.backend.tag.service.TagService;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TagService tagService;

    public static class NotFoundException extends RuntimeException {
        public NotFoundException(String message) {
            super(message);
        }
    }

    @Transactional
    public String createNote(NoteRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }


        Note note = Note.of(request.getTitle(), toNullable(request.getSubTitle()), toNullable(request.getDescription()), category, user);

        List<String> tagNames = Optional.ofNullable(request.getTags())
                .orElse(Collections.emptyList())
                .stream()
                .map(Tag::getName)
                .toList();

        List<Tag> tags = tagService.getOrCreateTags(user, tagNames);

        tags.forEach(note::addTag);

        noteRepository.save(note);

        return "success";
    }

    public void deleteNote(Long noteId, Long userId) {
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new RuntimeException("단어가 존재하지 않거나 권한이 없습니다."));

        noteRepository.delete(note);
    }

    // notes service
    public Page<Note> readAllWithOptionalFilters(Long userId, Long categoryId, Long tagId, String title, int page, int size, String sort) {
        String[] parts = sort.split(",");
        String property = parts[0];
        String direction = parts.length > 1 ? parts[1] : "asc";

        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.fromString(direction.toUpperCase()), property));
        String titleParam = (title == null || title.isBlank()) ? null : title;
        return noteRepository.findAllFiltered(userId, categoryId, tagId, titleParam, pageable);
    }
    // note id로 note 있는지 확인
    public boolean existsNote(Long noteId) {
        return noteRepository.existsById(noteId);
    }

    // 상세보기
    @Transactional(readOnly = true)
    public Note findNoteByUserId(Long noteId, Long userId) {
        User user = userRepository.getReferenceById(userId);
        return noteRepository.findNoteByUserId(noteId, user).orElseThrow(()-> new RuntimeException("Note not found"));
    }

    // 빈 값을 NULL 처리
    public static String toNullable(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }

    @Transactional
    public NoteResponse updateNote(Long noteId, Long userId, NoteRequest req) {

        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new NotFoundException("Note not found"));

        User user = userRepository.getReferenceById(userId);

        Category category = Optional.ofNullable(req.getCategoryId())
                .map(categoryRepository::getReferenceById)
                .orElse(null);

        /* 1) 필드 업데이트 */
        note.updateNote(req.getTitle(), req.getSubTitle(), req.getDescription(), category);

        /* 2) 태그 동기화 */
        List<Tag> tags = tagService.getOrCreateTags(user,               // user별 태그 재사용
                req.getTags().stream()
                        .map(Tag::getName)
                        .toList());

        syncTags(note, tags);   // Δ 알고리즘 호출

        return NoteResponse.fromEntity(note);  // flush 는 @Transactional 종료 시점
    }

    @Transactional
    public void syncTags(Note note, List<Tag> targetTags) {

        /* -------------------------
         * 1) 현재·목표 태그 집합 준비
         * ------------------------- */
        Set<Tag> current = note.getNoteTags().stream()
                .map(NoteTag::getTag)
                .collect(Collectors.toSet());
        Set<Tag> target  = new HashSet<>(targetTags);

        /* -------------------------
         * 2) 제거 대상 = 현재 ∖ 목표
         * ------------------------- */
        current.stream()
                .filter(tag -> !target.contains(tag))
                .forEach(tag -> {
                    /* NoteTag 찾기 */
                    note.getNoteTags().stream()
                            .filter(nt -> nt.getTag().equals(tag))
                            .findFirst()
                            .ifPresent(NoteTag::unlink);   // 양방향 제거
                });

        /* -------------------------
         * 3) 추가 대상 = 목표 ∖ 현재
         * ------------------------- */
        target.stream()
                .filter(tag -> !current.contains(tag))
                .forEach(note::addTag);                 // 새 NoteTag 생성
    }


    // category Null 인 items return
    @Transactional(readOnly = true)
    public Page<Note> findNotesWithoutCategory(Long userId, Pageable pageable) {
        return noteRepository.findNotesWithNullCategoryByUser(userId, pageable);
    }
}
