package com.sisyphus.backend.note.service;

import com.sisyphus.backend.category.entity.Category;
import com.sisyphus.backend.category.exception.CategoryNotFoundException;
import com.sisyphus.backend.category.repository.CategoryRepository;
import com.sisyphus.backend.global.dto.PageResponse;
import com.sisyphus.backend.image.entity.NoteImage;
import com.sisyphus.backend.image.exception.NotFoundImageException;
import com.sisyphus.backend.image.repository.ImageRepository;
import com.sisyphus.backend.image.repository.NoteImageRepository;
import com.sisyphus.backend.image.service.ImageService;
import com.sisyphus.backend.note.dto.NoteRequest;
import com.sisyphus.backend.note.dto.NoteResponse;
import com.sisyphus.backend.note.entity.Note;
import com.sisyphus.backend.note.exception.NoteNotFoundException;
import com.sisyphus.backend.note.repository.NoteRepository;
import com.sisyphus.backend.tag.entity.Tag;
import com.sisyphus.backend.tag.repository.TagRepository;
import com.sisyphus.backend.tag.service.TagService;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.exception.UserNotFoundException;
import com.sisyphus.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;


@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final NoteImageRepository noteImageRepository;
    private final ImageRepository imageRepository;
    private final TagRepository tagRepository;
    private final TagService tagService;
    private final ImageService imageService;

    /* -------------------- CUD -------------------- */

    @Transactional
    public Long createNote(NoteRequest request, Long userId) {

        // 1) 요청 해석(조회) - 여기서는 "데이터를 준비"만 한다
        User user = findUserOrThrow(userId);
        Category category = findCategoryOrNull(request.getCategoryId());
        List<Tag> tags = findTagsOrEmpty(request.getTagIds());
        List<NoteImage> images = findImagesOrEmpty(request.getImageId());

        // 2) 실제 생성(도메인 조립 + 저장)은 internal에서 담당
        Note saved = createNoteInternal(
                user,
                request.getTitle(),
                toNullable(request.getSubTitle()),
                toNullable(request.getDescription()),
                category,
                tags,
                images
        );

        // 문자열 "success" 대신 id 반환 추천 (컨트롤러에서 201 + id 응답 가능)
        return saved.getId();
    }

    /**
     * 노트 생성의 코어 로직(도메인 조립 + 저장).
     * - createNote / createDummyData 모두가 이걸 재사용하도록 만든다.
     */
    @Transactional
    protected Note createNoteInternal(
            User user,                 // role: 작성자, type: User
            String title,              // role: 제목, type: String
            String subTitle,           // role: 부제(Nullable), type: String
            String description,        // role: 본문(Nullable), type: String
            Category category,         // role: 카테고리(Nullable), type: Category
            List<Tag> tags,            // role: 태그 목록(Empty OK), type: List<Tag>
            List<NoteImage> images     // role: 이미지 목록(Empty OK), type: List<NoteImage>
    ) {
        Note note = Note.of(title, subTitle, description, category, user);

        if (tags != null && !tags.isEmpty()) {
            tags.forEach(note::addTag);
        }

        if (images != null && !images.isEmpty()) {
            images.forEach(note::addImage);
        }

        return noteRepository.save(note);
    }


    @Transactional
    public void deleteNote(Long noteId, Long userId) {
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(NoteNotFoundException::new);
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
                .orElseThrow(NoteNotFoundException::new);

        Category category = Optional.ofNullable(req.getCategoryId())
                .map(categoryRepository::getReferenceById)
                .orElse(null);

        // 1) 필드 업데이트
        note.updateNote(req.getTitle(), req.getSubTitle(), req.getDescription(), category);

        // 2) 태그 동기화
        List<Long> tagIds = Optional.ofNullable(req.getTagIds()).orElseGet(List::of);
        List<Tag> tags = tagIds.isEmpty()
                ? List.of()
                : tagService.findAllByIds(tagIds); // or tagRepository.findAllById(tagIds)

        tagService.syncTags(note, tags);

        // 3) 이미지 동기화(단일 이미지 기준이라면 clear 후 add)
        if (req.getImageId() != null) {
            NoteImage newImage = (NoteImage) imageRepository.findById(req.getImageId())
                    .orElseThrow(NotFoundImageException::new);

            note.clearImages();
            note.addImage(newImage);
        }

        return NoteResponse.fromEntity(note); // 트랜잭션 안에서 DTO 변환
    }

    /* -------------------- 조회 -------------------- */

    @Transactional(readOnly = true)
    public NoteResponse findNoteByUserId(Long noteId, Long userId) {
        User user = userRepository.getReferenceById(userId);
        Note note = noteRepository.findNoteByUserId(noteId, user)
                .orElseThrow(NoteNotFoundException::new);
        return NoteResponse.fromEntity(note);
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
        return toDetailedPage(p, pageable);
    }

    /**
     * 카테고리 없는 노트 페이징 (동일 패턴)
     */
    @Transactional(readOnly = true)
    public PageResponse<NoteResponse> findNotesWithoutCategory(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Note> p = noteRepository.findNotesWithNullCategoryByUser(userId, pageable);
        return toDetailedPage(p, pageable);
    }

    private PageResponse<NoteResponse> toDetailedPage(Page<Note> page, Pageable pageable) {
        if (page.isEmpty()) {
            return PageResponse.of(Page.empty(pageable));
        }

        List<Long> ids = page.getContent().stream().map(Note::getId).toList();
        var detailed = noteRepository.findDetailsByIdIn(ids);

        Map<Long, Integer> order = new HashMap<>();
        for (int i = 0; i < ids.size(); i++) {
            order.put(ids.get(i), i);
        }
        detailed.sort(Comparator.comparingInt(
                note -> order.getOrDefault(note.getId(), Integer.MAX_VALUE)
        ));

        return new PageResponse<>(
                detailed.stream().map(NoteResponse::fromEntity).toList(),
                page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages(),
                page.isFirst(), page.isLast()
        );
    }

    /* -------------------- utils -------------------- */

    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);
    }

    private Category findCategoryOrNull(Long categoryId) {
        if (categoryId == null) return null;
        return categoryRepository.findById(categoryId)
                .orElseThrow(CategoryNotFoundException::new);
    }

    private List<Tag> findTagsOrEmpty(List<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) return List.of();
        // tagService.findAllByIds(tagIds)로 통일해도 좋음
        return tagRepository.findAllById(tagIds);
    }

    private List<NoteImage> findImagesOrEmpty(Long imageId) {
        if (imageId == null) return List.of();
        NoteImage img = noteImageRepository.findById(imageId)
                .orElseThrow(NotFoundImageException::new);
        return List.of(img);
    }

    public static String toNullable(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }
}
