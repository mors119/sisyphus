package com.sisyphus.backend.tag.service;

import com.sisyphus.backend.note.entity.Note;
import com.sisyphus.backend.tag.entity.NoteTag;
import com.sisyphus.backend.tag.dto.TagRequest;
import com.sisyphus.backend.tag.dto.TagResponse;
import com.sisyphus.backend.tag.entity.Tag;
import com.sisyphus.backend.tag.exception.TagNotFoundException;
import com.sisyphus.backend.tag.repository.TagRepository;
import com.sisyphus.backend.global.exception.ForbiddenException;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Tag application service.
 * Tags are scoped to the owning user and unique by name per user.
 */
@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final UserService userService;

    /**
     * 모든 태그 목록 조회
     */
    @Transactional(readOnly = true)
    public List<TagResponse> list(Long userId) {
        return tagRepository.findAllByUserId(userId).stream()
                .map(TagResponse::fromEntity)
                .toList();
    }

    /**
     * 태그가 있으면 반환, 없으면 새로 생성
     */
    @Transactional
    public List<Tag> getOrCreate(List<TagRequest> requests, Long userId) {


        User owner = userService.findById(userId);

        List<Tag> result = new ArrayList<>();

        for (TagRequest dto : requests) {
            String raw = dto.getName();
            if (raw == null || raw.trim().isEmpty()) continue; // 빈 이름 건너뛰기
            String name = raw.trim();

            Tag tag = tagRepository.findByNameAndUserId(name, userId)
                    .orElseGet(() -> tagRepository.save(Tag.of(name, owner)));
            result.add(tag);
        }
        return result;
    }

    /**
     * 태그 이름 수정
     */
    @Transactional
    public TagResponse update(Long id, String newName, Long userId) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(TagNotFoundException::new);

        if (!tag.getUser().getId().equals(userId)) {
            throw new ForbiddenException("해당 태그에 접근할 권한이 없습니다.");
        }

        tag.changeName(newName);
        return TagResponse.fromEntity(tag);
    }

    /**
     * 태그 삭제
     */
    @Transactional
    public void delete(List<Long> tagIds, Long userId) {
        if (tagIds == null || tagIds.isEmpty()) {
            throw new IllegalArgumentException("삭제할 태그 ID 목록이 비어 있습니다.");
        }

        List<Tag> tags = tagRepository.findAllById(tagIds);

        for (Tag tag : tags) {
            if (!tag.getUser().getId().equals(userId)) {
                throw new ForbiddenException(
                        String.format("사용자 %d는 태그 ID %d에 대한 삭제 권한이 없습니다.", userId, tag.getId())
                );
            }
        }

        tagRepository.deleteAll(tags);
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

    // 태그 아이디 전체 조회
    @Transactional(readOnly = true)
    public List<Tag> findAllByIds(List<Long> ids) {
        return tagRepository.findAllById(ids);
    }

}

