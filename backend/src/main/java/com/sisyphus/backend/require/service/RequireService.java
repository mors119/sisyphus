package com.sisyphus.backend.require.service;

import com.sisyphus.backend.require.dto.CommentResponse;
import com.sisyphus.backend.require.dto.RequireRequest;
import com.sisyphus.backend.require.dto.RequireResponse;
import com.sisyphus.backend.require.entity.Require;
import com.sisyphus.backend.require.repository.RequireRepository;
import com.sisyphus.backend.require.util.RequireStatus;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.repository.UserRepository;
import com.sisyphus.backend.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RequireService {

    private final RequireRepository requireRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final CommentService commentService;

    // 등록
    public RequireResponse create(Long userId, RequireRequest dto) {
        User user = userService.findById(userId);
        Require require = Require.builder()
                .user(user)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .status(RequireStatus.RECEIVED)
                .build();

        return toDto(requireRepository.save(require));
    }

    // 본인의 요청 전체 조회
    public Page<RequireResponse> getRequiresByUser(Long userId, Pageable pageable) {
        User user = userService.findById(userId);

        return requireRepository.findByUser_Id(user.getId(), pageable)
                .map(this::toDto); // 안전한 방식으로 DTO 매핑
    }

    // 본인의 특정 요청 단건 조회
    public RequireResponse getRequireById(Long userId, Long id) {
        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("User not found");
        }
        Require require = requireRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("요청을 찾을 수 없습니다."));
        return toDto(require);
    }

    // 본인의 요청 수정
//    @Transactional
//    public RequireResponse update(Long userId, Long id, RequireRequest dto) {
//        Require require = requireRepository.findByIdAndUserId(id, userId)
//                .orElseThrow(() -> new IllegalArgumentException("수정 권한이 없거나 요청이 존재하지 않습니다."));
//
//        require.updateContent(dto.getTitle(), dto.getDescription());
//
//        return toDto(require);
//    }
//
//    // 본인의 요청 삭제
//    public void delete(Long userId, Long id) {
//        Require require = requireRepository.findByIdAndUserId(id, userId)
//                .orElseThrow(() -> new IllegalArgumentException("삭제 권한이 없거나 요청이 존재하지 않습니다."));
//        requireRepository.delete(require);
//    }

    // Entity → DTO 변환
    private RequireResponse toDto(Require require) {
        List<CommentResponse> commentResponses = require.getComments().stream()
                .map(commentService::toDto) // ✅ 이렇게 사용 가능
                .collect(Collectors.toList());

        String email = require.getUser().getEmail();

        return RequireResponse.builder()
                .id(require.getId())
                .title(require.getTitle())
                .description(require.getDescription())
                .status(require.getStatus())
                .createdAt(require.getCreatedAt())
                .userEmail(email)
                .comments(commentResponses)
                .build();
    }
}
