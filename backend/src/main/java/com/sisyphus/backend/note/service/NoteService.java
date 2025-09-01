package com.sisyphus.backend.note.service;

import com.sisyphus.backend.category.entity.Category;
import com.sisyphus.backend.category.repository.CategoryRepository;
import com.sisyphus.backend.global.dto.PageResponse;
import com.sisyphus.backend.image.entity.NoteImage;
import com.sisyphus.backend.image.repository.ImageRepository;
import com.sisyphus.backend.image.repository.NoteImageRepository;
import com.sisyphus.backend.image.service.ImageService;
import com.sisyphus.backend.note.dto.NoteRequest;
import com.sisyphus.backend.note.dto.NoteResponse;
import com.sisyphus.backend.note.entity.Note;
import com.sisyphus.backend.note.repository.NoteRepository;
import com.sisyphus.backend.tag.entity.Tag;
import com.sisyphus.backend.tag.service.TagService;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
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
    private final NoteImageRepository noteImageRepository;
    private final ImageRepository imageRepository;
    private final TagService tagService;
    private final ImageService imageService;

    public static class NotFoundException extends RuntimeException {
        public NotFoundException(String message) { super(message); }
    }

    /* -------------------- CUD -------------------- */

    @Transactional
    public String createNote(NoteRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        Note note = Note.of(
                request.getTitle(),
                toNullable(request.getSubTitle()),
                toNullable(request.getDescription()),
                category,
                user
        );

        // 태그
        List<String> tagNames = Optional.ofNullable(request.getTags())
                .orElse(Collections.emptyList())
                .stream()
                .map(Tag::getName)
                .toList();
        List<Tag> tags = tagService.getOrCreateTags(user, tagNames);
        tags.forEach(note::addTag);

        // 이미지(선택)
        if (request.getImageId() != null) {
            NoteImage noteImage = noteImageRepository.findById(request.getImageId())
                    .orElseThrow(() -> new RuntimeException("NoteImage not found"));
            note.addImage(noteImage);
        }

        noteRepository.save(note);
        return "success";
    }

    @Transactional
    public void deleteNote(Long noteId, Long userId) {
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new RuntimeException("노트가 존재하지 않거나 권한이 없습니다."));

        // 이미지 실제 파일/레코드 삭제 → 연관 관계 해제
        // (컬렉션을 복사한 뒤 순회해야 ConcurrentModificationException 방지)
        var imagesCopy = new ArrayList<>(note.getImages());
        for (NoteImage img : imagesCopy) {
            note.removeImage(img);              // 연관 제거
            imageService.delete(img.getId());   // 스토리지/레코드 정리 (구현체 기준)
        }

        noteRepository.delete(note);
    }

    @Transactional
    public NoteResponse updateNote(Long noteId, Long userId, NoteRequest req) {
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new NotFoundException("Note not found"));

        User user = userRepository.getReferenceById(userId);

        Category category = Optional.ofNullable(req.getCategoryId())
                .map(categoryRepository::getReferenceById)
                .orElse(null);

        // 1) 필드 업데이트
        note.updateNote(req.getTitle(), req.getSubTitle(), req.getDescription(), category);

        // 2) 태그 동기화
        List<Tag> tags = tagService.getOrCreateTags(
                user,
                Optional.ofNullable(req.getTags()).orElseGet(List::of).stream()
                        .map(Tag::getName)
                        .toList()
        );
        tagService.syncTags(note, tags);

        // 3) 이미지 동기화(단일 이미지 기준이라면 clear 후 add)
        if (req.getImageId() != null) {
            NoteImage newImage = (NoteImage) imageRepository.findById(req.getImageId())
                    .orElseThrow(() -> new NotFoundException("Image not found"));

            note.clearImages();
            note.addImage(newImage);
        }

        return NoteResponse.fromEntity(note); // 트랜잭션 안에서 DTO 변환
    }

    /* -------------------- 조회 -------------------- */

    public boolean existsNote(Long noteId) { return noteRepository.existsById(noteId); }

    @Transactional(readOnly = true)
    public Note findNoteByUserId(Long noteId, Long userId) {
        User user = userRepository.getReferenceById(userId);
        return noteRepository.findNoteByUserId(noteId, user)
                .orElseThrow(() -> new RuntimeException("Note not found"));
    }

    /**
     * 페이징 목록 조회 (경고/LAZY 예외 없이):
     *  1) Page 쿼리(컬렉션 fetch 없음)
     *  2) 상세 fetch(in :ids)
     *  3) 트랜잭션 안에서 DTO 변환 + PageResponse 래핑
     */
    @Transactional(readOnly = true)
    public PageResponse<NoteResponse> readAllWithOptionalFilters(
            Long userId, Long categoryId, Long tagId,
            String title, int page, int size, String sort
    ) {
        // 정렬 파싱 (예: "createdAt,desc")
        String property = "createdAt";
        Sort.Direction direction = Sort.Direction.DESC;
        if (sort != null && !sort.isBlank()) {
            String[] parts = sort.split(",");
            property = parts[0];
            if (parts.length > 1) direction = Sort.Direction.fromString(parts[1]);
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, property));

        // 제목 패턴 (서비스에서 만들기)
        String titlePattern = (title == null || title.isBlank())
                ? null
                : "%" + title.toLowerCase(Locale.ROOT) + "%";

        // 1) 페이지(컬렉션 fetch 없음 → 경고 없음)
        Page<Note> p = noteRepository.findAllFiltered(userId, categoryId, tagId, titlePattern, pageable);
        if (p.isEmpty()) {
            return PageResponse.of(Page.empty(pageable));
        }

        // 2) 상세 fetch (images, noteTags.tag)
        List<Long> ids = p.getContent().stream().map(Note::getId).toList();
        var detailed = noteRepository.findDetailsByIdIn(ids);

        // 3) 원래 순서 보존 정렬
        Map<Long, Integer> ord = new HashMap<>();
        for (int i = 0; i < ids.size(); i++) ord.put(ids.get(i), i);
        detailed.sort(Comparator.comparingInt(n -> ord.getOrDefault(n.getId(), Integer.MAX_VALUE)));

        // 4) 트랜잭션 안에서 DTO 변환
        List<NoteResponse> content = detailed.stream()
                .map(NoteResponse::fromEntity)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                p.getNumber(), p.getSize(),
                p.getTotalElements(), p.getTotalPages(),
                p.isFirst(), p.isLast()
        );
    }

    /**
     * 카테고리 없는 노트 페이징 (동일 패턴)
     */
    @Transactional(readOnly = true)
    public PageResponse<NoteResponse> findNotesWithoutCategory(Long userId, Pageable pageable) {
        Page<Note> p = noteRepository.findNotesWithNullCategoryByUser(userId, pageable);
        if (p.isEmpty()) {
            return PageResponse.of(Page.empty(pageable));
        }

        List<Long> ids = p.getContent().stream().map(Note::getId).toList();
        var detailed = noteRepository.findDetailsByIdIn(ids);

        Map<Long, Integer> ord = new HashMap<>();
        for (int i = 0; i < ids.size(); i++) ord.put(ids.get(i), i);
        detailed.sort(Comparator.comparingInt(n -> ord.getOrDefault(n.getId(), Integer.MAX_VALUE)));

        List<NoteResponse> content = detailed.stream()
                .map(NoteResponse::fromEntity)
                .toList();

        return new PageResponse<>(
                content,
                p.getNumber(), p.getSize(),
                p.getTotalElements(), p.getTotalPages(),
                p.isFirst(), p.isLast()
        );
    }

    /* -------------------- utils -------------------- */

    public static String toNullable(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }
}
