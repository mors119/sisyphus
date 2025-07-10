package com.sisyphus.backend.tag.service;

import com.sisyphus.backend.tag.dto.TagRequest;
import com.sisyphus.backend.tag.entity.Tag;
import com.sisyphus.backend.tag.repository.TagRepository;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * TagService (user‑free version)
 * — Tag 엔티티에 owner 필드가 없다는 전제.
 * — 모든 태그는 전역 공유 & name UNIQUE.
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
    public List<Tag> list(Long userId) {
        return tagRepository.findAllByOwnerId(userId);
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

            Tag tag = tagRepository.findByNameAndOwnerId(name, userId)
                    .orElseGet(() -> tagRepository.save(Tag.of(name, owner)));
            result.add(tag);
        }
        return result;
    }

    /**
     * 현재 유저가 사용할 태그들을 조회 or 생성
     */
    @Transactional
    public List<Tag> getOrCreateTags(User user, List<String> tagNames) {
        if (tagNames.isEmpty()) return List.of();

        // 기존 태그 가져오기
        List<Tag> existing = tagRepository.findByOwnerIdAndNameIn(user.getId(), tagNames);
        Set<String> existingNames = existing.stream()
                .map(Tag::getName)
                .collect(Collectors.toSet());

        // 없는 태그는 새로 생성
        List<Tag> toCreate = tagNames.stream()
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(name -> !existingNames.contains(name))
                .map(name -> Tag.of(name, user))
                .toList();

        // 저장 후 합치기
        List<Tag> saved = tagRepository.saveAll(toCreate);
        List<Tag> result = new ArrayList<>(existing);
        result.addAll(saved);

        return result;
    }

    /**
     * 태그 이름 수정
     */
    @Transactional
    public Tag update(Long id, String newName, Long userId) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("태그를 찾을 수 없습니다"));

        if (!tag.getOwner().getId().equals(userId)) {
            throw new SecurityException("권한이 없습니다");
        }

        tag.changeName(newName);
        return tag;
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
            if (!tag.getOwner().getId().equals(userId)) {
                throw new SecurityException(
                        String.format("사용자 %d는 태그 ID %d에 대한 삭제 권한이 없습니다.", userId, tag.getId())
                );
            }
        }

        tagRepository.deleteAll(tags);
    }
}

