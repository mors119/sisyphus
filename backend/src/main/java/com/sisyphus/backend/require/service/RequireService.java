package com.sisyphus.backend.require.service;

import com.sisyphus.backend.require.dto.RequireRequest;
import com.sisyphus.backend.require.dto.RequireResponse;
import com.sisyphus.backend.require.dto.StatusCountResponse;
import com.sisyphus.backend.require.entity.Require;
import com.sisyphus.backend.require.repository.RequireRepository;
import com.sisyphus.backend.require.util.RequireStatus;
import com.sisyphus.backend.require.util.RequireType;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.repository.UserRepository;
import com.sisyphus.backend.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final UserRepository userRepository;
//    private final CommentService commentService;

    // 등록
    @Transactional
    public RequireResponse create(Long userId, RequireRequest dto) {
        User user = userService.findById(userId);
        RequireType type = RequireType.from(dto.getRequireType());

        Require require = Require.builder().user(user).requireType(type).title(dto.getTitle()).description(dto.getDescription()).status(RequireStatus.RECEIVED).build();

        return toDto(requireRepository.save(require));
    }

    // 본인의 요청 전체 조회
    @Transactional(readOnly = true)
    public Page<RequireResponse> getRequiresByUser(Long userId, Pageable pageable) {
        User user = userService.findById(userId);

        return requireRepository.findByUser_Id(user.getId(), pageable).map(this::toDto); // 안전한 방식으로 DTO 매핑
    }

    // 본인의 특정 요청 단건 조회
    @Transactional(readOnly = true)
    public RequireResponse getRequireById(Long userId, Long id) {
        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("User not found");
        }
        Require require = requireRepository.findByIdAndUserId(id, userId).orElseThrow(() -> new IllegalArgumentException("요청을 찾을 수 없습니다."));
        return toDto(require);
    }

    // 본인의 요청 수정
    @Transactional
    public RequireResponse update(Long userId, Long id, RequireRequest dto) {
        Require require = requireRepository.findByIdAndUserId(id, userId).orElseThrow(() -> new IllegalArgumentException("수정 권한이 없거나 요청이 존재하지 않습니다."));

        require.updateContent(dto.getTitle(), dto.getDescription());

        return toDto(require);
    }

    // 본인의 요청 삭제
    @Transactional
    public void delete(Long userId, Long id) {
        Require require = requireRepository.findByIdAndUserId(id, userId).orElseThrow(() -> new IllegalArgumentException("삭제 권한이 없거나 요청이 존재하지 않습니다."));
        requireRepository.delete(require);
    }

    // status 변환
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateStatus(Long id, RequireStatus status) {
        int updated = requireRepository.updateStatus(id, status);
        if (updated == 0) throw new IllegalArgumentException("요청이 존재하지 않습니다.");
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
    public Page<RequireResponse> getRequiresAll(Pageable pageable) {
        return requireRepository.findAll(pageable).map(this::toDto);
    }

    public List<StatusCountResponse> requireStatusCounts() {

        LocalDate currentDate = LocalDate.now();
        List<StatusCountResponse> result = new ArrayList<>();  // 결과 리스트를 초기화

        // 6개월 간 데이터
        for (int i = 0; i < 6; i++) {
            // 1개월씩 뺀 날짜 계산
            LocalDate startDate = currentDate.minusMonths(i + 1).withDayOfMonth(1); // 시작 날짜 (1일)
            LocalDate endDate = startDate.plusMonths(1).minusDays(1); // 끝 날짜 (해당 월의 마지막 날)

            // 날짜 포맷을 yyyy-MM-dd 형식으로 변환
            LocalDateTime startDateTime = startDate.atStartOfDay();  // 시작 날짜 (1일, 00:00:00)
            LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

            // 해당 월에 대한 상태별 카운트를 가져와서 리스트에 추가
            List<StatusCountResponse> monthlyResult = requireRepository.countAllStatusesByMonth(startDateTime, endDateTime);
            result.addAll(monthlyResult);  // 누적하여 추가
        }
        return result;
    }

}
