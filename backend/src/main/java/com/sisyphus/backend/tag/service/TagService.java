package com.sisyphus.backend.tag.service;

import com.sisyphus.backend.tag.dto.TagRequest;
import com.sisyphus.backend.tag.entity.Tag;
import com.sisyphus.backend.tag.repository.TagRepository;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.repository.UserRepository;
import com.sisyphus.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<Tag> getAllTags(Long userId) {
        return tagRepository.findAllByUserId(userId);
    }

    public void createTag(TagRequest tagRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Tag tag = new Tag();
        tag.setTitle(tagRequest.getTitle());
        tag.setColor(tagRequest.getColor());
        tag.setUser(user);

        // 부모 태그 설정
        if (tagRequest.getParentId() != null) {
            Tag parent = tagRepository.findById(tagRequest.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("부모 태그를 찾을 수 없습니다."));
            tag.setParent(parent);
        }

        tagRepository.save(tag);
    }

    @Transactional
    public void deleteTag(Long id) {
        Tag tag = tagRepository.findWithChildrenById(id)
                .orElseThrow(() -> new IllegalArgumentException("태그를 찾을 수 없습니다."));

        // 자식 태그 먼저 재귀 삭제
        deleteChildren(tag);

        tagRepository.delete(tag);
    }

    // 자식 tag 삭제 함수
    private void deleteChildren(Tag tag) {
        for (Tag child : tag.getChildren()) {
            deleteChildren(child); // 자식의 자식도 재귀적으로 삭제
            tagRepository.delete(child);
        }
    }

    @Transactional
    public void updateTag(Long tagId, TagRequest request, Long userId) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new IllegalArgumentException("태그를 찾을 수 없습니다."));

        // 사용자 검증 (보안용)
        if (!tag.getUser().getId().equals(userId)) {
            throw new SecurityException("해당 태그를 수정할 권한이 없습니다.");
        }

        tag.setTitle(request.getTitle());
        tag.setColor(request.getColor());

        if (request.getParentId() != null) {
            Tag parent = tagRepository.findById(request.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("부모 태그를 찾을 수 없습니다."));
            tag.setParent(parent);
        } else {
            tag.setParent(null);
        }
        // JPA dirty checking 으로 자동 저장됨
    }

}
