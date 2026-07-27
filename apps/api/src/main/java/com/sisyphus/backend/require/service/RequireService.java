package com.sisyphus.backend.require.service;

import com.sisyphus.backend.global.dto.PageResponse;
import com.sisyphus.backend.require.dto.RequireRequest;
import com.sisyphus.backend.require.dto.RequireResponse;
import com.sisyphus.backend.require.dto.StatusCountResponse;
import com.sisyphus.backend.require.entity.Require;
import com.sisyphus.backend.require.exception.RequireNotFoundException;
import com.sisyphus.backend.require.repository.RequireRepository;
import com.sisyphus.backend.require.util.RequireStatus;
import com.sisyphus.backend.require.util.RequireType;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RequireService {

    private final RequireRepository requireRepository;
    private final UserService userService;

    // 등록
    @Transactional
    public RequireResponse create(Long userId, RequireRequest dto) {
        User user = userService.findById(userId);
        RequireType type = dto.getRequireType();

        Require require = Require.builder().user(user).requireType(type).title(dto.getTitle()).description(dto.getDescription()).status(RequireStatus.RECEIVED).build();

        return toDto(requireRepository.save(require));
    }

    // 본인의 요청 전체 조회
    @Transactional(readOnly = true)
    public PageResponse<RequireResponse> getRequiresByUser(Long userId, Pageable pageable) {
        User user = userService.findById(userId);

        Page<RequireResponse> page = requireRepository
                .findByUser_Id(user.getId(), pageable)
                .map(this::toDto);

        return PageResponse.of(page);
    }

    // 본인의 특정 요청 단건 조회
    @Transactional(readOnly = true)
    public RequireResponse getRequireById(Long userId, Long id) {
        Require require = requireRepository.findByIdAndUserId(id, userId)
                .orElseThrow(RequireNotFoundException::new);
        return toDto(require);
    }

    // 본인의 요청 수정
    @Transactional
    public RequireResponse update(Long userId, Long id, RequireRequest dto) {
        Require require = requireRepository.findByIdAndUserId(id, userId)
                .orElseThrow(RequireNotFoundException::new);

        require.updateContent(dto.getTitle(), dto.getDescription());

        return toDto(require);
    }

    // 본인의 요청 삭제
    @Transactional
    public void delete(Long userId, Long id) {
        Require require = requireRepository.findByIdAndUserId(id, userId)
                .orElseThrow(RequireNotFoundException::new);
        requireRepository.delete(require);
    }

    // status 변환
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateStatus(Long id, RequireStatus status) {
        int updated = requireRepository.updateStatus(id, status);
        if (updated == 0) throw new RequireNotFoundException();
    }

    // Entity → DTO 변환
    private RequireResponse toDto(Require require) {
//        List<CommentResponse> commentResponses = require.getComments().stream()
//                .map(commentService::toDto) // 이렇게 사용 가능
//                .collect(Collectors.toList());

        String email = require.getUser().getEmail();

        return RequireResponse.builder().id(require.getId()).title(require.getTitle()).description(require.getDescription()).status(require.getStatus()).requireType(require.getRequireType()).createdAt(require.getCreatedAt()).userEmail(email)
//                .comments(commentResponses)
                .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<RequireResponse> getRequiresAll(int page, int size) {
         Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
         Page<RequireResponse> p = requireRepository.findAll(pageable).map(this::toDto);
         return PageResponse.of(p);
    }
    @Transactional(readOnly = true)
    public List<StatusCountResponse> requireStatusCounts(Long userId) {
        LocalDate today = LocalDate.now();

        // 최근 6개월: (이번달 포함) 이번달 1일 ~ 다음달 1일, from은 5개월 전 1일
        LocalDate fromDate = today.withDayOfMonth(1).minusMonths(5);
        LocalDate toDate = today.withDayOfMonth(1).plusMonths(1);

        LocalDateTime from = fromDate.atStartOfDay();
        LocalDateTime to = toDate.atStartOfDay(); // to는 exclusive가 안전

        return requireRepository.countAllStatusesInRange(userId, from, to);
    }

}
