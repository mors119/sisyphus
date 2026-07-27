package com.sisyphus.backend.require.controller;

import com.sisyphus.backend.global.dto.PageResponse;
import com.sisyphus.backend.require.dto.*;
import com.sisyphus.backend.security.principal.UserPrincipal;
import com.sisyphus.backend.require.service.RequireService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Require", description = "요구사항(Require) CRUD 및 관리자 대시보드 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/require")
public class RequireController {

    private final RequireService requireService;

    @Operation(
            summary = "요구사항 등록",
            description = "현재 로그인한 사용자의 요구사항을 생성합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/create")
    public ResponseEntity<RequireResponse> createRequire(
            @RequestBody @Valid RequireRequest requestDto,
            @AuthenticationPrincipal UserPrincipal principal // principal: 인증된 사용자
    ) {
        Long userId = principal.getId(); // getId()는 네 UserPrincipal에 맞춰 사용
        RequireResponse response = requireService.create(userId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
            summary = "내 요구사항 목록 조회(페이지)",
            description = "현재 로그인한 사용자의 요구사항을 페이지 형태로 조회합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/readAll")
    public ResponseEntity<PageResponse<RequireResponse>> getMyRequires(
            @Parameter(description = "페이지/정렬 정보 (기본: size=10, sort=createdAt, desc)")
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal.getId();
        PageResponse<RequireResponse> page = requireService.getRequiresByUser(userId, pageable);
        return ResponseEntity.ok(page);
    }

    @Operation(
            summary = "요구사항 단건 조회",
            description = "요구사항 ID로 단건 조회합니다. (본인 소유 데이터만 조회 가능)"
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<RequireResponse> getRequireById(
            @Parameter(description = "요구사항 ID", example = "1")
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal.getId();
        RequireResponse response = requireService.getRequireById(userId, id);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "요구사항 수정",
            description = "요구사항 ID를 기준으로 내용을 수정합니다. (본인 소유 데이터만 수정 가능)"
    )
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<RequireResponse> updateRequire(
            @Parameter(description = "요구사항 ID", example = "1")
            @PathVariable Long id,
            @RequestBody @Valid RequireRequest requestDto,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal.getId();
        RequireResponse response = requireService.update(userId, id, requestDto);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "요구사항 삭제",
            description = "요구사항 ID를 기준으로 삭제합니다. (본인 소유 데이터만 삭제 가능)"
    )
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequire(
            @Parameter(description = "요구사항 ID", example = "1")
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal.getId();
        requireService.delete(userId, id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "요구사항 상태 변경 (ADMIN)",
            description = "관리자가 특정 요구사항의 상태를 변경합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/status/{id}")
    public ResponseEntity<Void> updateRequireStatus(
            @Parameter(description = "요구사항 ID", example = "1")
            @PathVariable Long id,
            @RequestBody @Valid RequireStatusRequest req
    ) {
        requireService.updateStatus(id, req.status());
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "대시보드 전체 요구사항 조회 (ADMIN)",
            description = "관리자 대시보드에서 전체 요구사항을 페이지로 조회합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/dashboard")
    public ResponseEntity<PageResponse<RequireResponse>> getAllRequires(
            @Parameter(description = "페이지 번호(0부터)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기", example = "10")
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<RequireResponse> body = requireService.getRequiresAll(page, size);
        return ResponseEntity.ok(body);
    }

    @Operation(
            summary = "월별 상태 카운트 조회 (ADMIN)",
            description = "대시보드 차트용: 월별 상태(Received/InProgress/Completed 등) 카운트를 반환합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/status/count")
    public ResponseEntity<List<StatusCountResponse>> getAllRequireStatus(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(requireService.requireStatusCounts(principal.getId()));
    }
}
