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
import java.util.List;

@Service
@RequiredArgsConstructor
/**
 * Handles require CRUD workflows and dashboard-oriented read models.
 */
public class RequireService {

    private final RequireRepository requireRepository;
    private final UserService userService;

    /**
     * Creates a new require for the given user.
     *
     * @param userId owner id
     * @param dto create payload
     * @return created require response
     */
    @Transactional
    public RequireResponse create(Long userId, RequireRequest dto) {
        User user = userService.findById(userId);
        RequireType type = dto.getRequireType();

        Require require = Require.builder().user(user).requireType(type).title(dto.getTitle()).description(dto.getDescription()).status(RequireStatus.RECEIVED).build();

        return toDto(requireRepository.save(require));
    }

    /**
     * Returns a paginated list of requires owned by the given user.
     *
     * @param userId owner id
     * @param pageable page and sort request
     * @return paginated require response list
     */
    @Transactional(readOnly = true)
    public PageResponse<RequireResponse> getRequiresByUser(Long userId, Pageable pageable) {
        User user = userService.findById(userId);

        Page<RequireResponse> page = requireRepository
                .findByUser_Id(user.getId(), pageable)
                .map(this::toDto);

        return PageResponse.of(page);
    }

    /**
     * Returns a single require owned by the given user.
     *
     * @param userId owner id
     * @param id require id
     * @return matching require response
     */
    @Transactional(readOnly = true)
    public RequireResponse getRequireById(Long userId, Long id) {
        Require require = requireRepository.findByIdAndUserId(id, userId)
                .orElseThrow(RequireNotFoundException::new);
        return toDto(require);
    }

    /**
     * Updates a require owned by the given user.
     *
     * @param userId owner id
     * @param id require id
     * @param dto update payload
     * @return updated require response
     */
    @Transactional
    public RequireResponse update(Long userId, Long id, RequireRequest dto) {
        Require require = requireRepository.findByIdAndUserId(id, userId)
                .orElseThrow(RequireNotFoundException::new);

        require.updateContent(dto.getTitle(), dto.getDescription());

        return toDto(require);
    }

    /**
     * Deletes a require owned by the given user.
     *
     * @param userId owner id
     * @param id require id
     */
    @Transactional
    public void delete(Long userId, Long id) {
        Require require = requireRepository.findByIdAndUserId(id, userId)
                .orElseThrow(RequireNotFoundException::new);
        requireRepository.delete(require);
    }

    /**
     * Updates a require status in an isolated transaction for admin workflows.
     *
     * @param id require id
     * @param status new status value
     */
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
                .build();
    }

    @Transactional(readOnly = true)
    /**
     * Returns a paginated dashboard view of all requires.
     *
     * @param page zero-based page number
     * @param size page size
     * @return paginated require response list
     */
    public PageResponse<RequireResponse> getRequiresAll(int page, int size) {
         Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
         Page<RequireResponse> p = requireRepository.findAll(pageable).map(this::toDto);
         return PageResponse.of(p);
    }

    @Transactional(readOnly = true)
    /**
     * Returns recent monthly status counts for dashboard charting.
     *
     * @param userId owner id
     * @return monthly status counts
     */
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
