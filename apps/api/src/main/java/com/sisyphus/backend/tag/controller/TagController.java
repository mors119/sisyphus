package com.sisyphus.backend.tag.controller;

import com.sisyphus.backend.security.principal.UserPrincipal;
import com.sisyphus.backend.tag.dto.TagRequest;
import com.sisyphus.backend.tag.dto.TagResponse;
import com.sisyphus.backend.tag.service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 태그 이름 충돌 방지
@io.swagger.v3.oas.annotations.tags.Tag(name = "Tag", description = "태그(Tag) CRUD API")
@RestController
@RequestMapping("/api/tag")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @Operation(
            summary = "태그 목록 조회",
            description = "현재 로그인한 사용자의 태그 목록을 반환합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패(JWT 누락/만료)")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<List<TagResponse>> list(
            @Parameter(hidden = true)
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal.getId();

        return ResponseEntity.ok(tagService.list(userId));
    }

    @Operation(
            summary = "태그 생성/가져오기",
            description = """
                요청으로 전달된 태그 리스트를 기준으로,
                이미 존재하는 태그는 가져오고, 없으면 새로 생성합니다.
                """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "처리 성공"),
            @ApiResponse(responseCode = "400", description = "요청 값 오류"),
            @ApiResponse(responseCode = "401", description = "인증 실패(JWT 누락/만료)")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<Void> create(
            @Parameter(hidden = true)
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody @Valid List<TagRequest> tagRequests // tagRequests: 생성/동기화할 태그 목록
    ) {
        Long userId = principal.getId();
        tagService.getOrCreate(tagRequests, userId);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "태그 수정",
            description = "태그 ID를 기준으로 이름을 수정합니다. (본인 소유 태그만 수정 가능)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "400", description = "요청 값 오류"),
            @ApiResponse(responseCode = "401", description = "인증 실패(JWT 누락/만료)"),
            @ApiResponse(responseCode = "404", description = "대상이 없거나 접근 불가")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/update")
    public ResponseEntity<TagResponse> update(
            @Parameter(hidden = true)
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody @Valid TagRequest dto // dto.id, dto.name
    ) {
        Long userId = principal.getId();

        return ResponseEntity.ok(tagService.update(dto.getId(), dto.getName(), userId));
    }

    @Operation(
            summary = "태그 삭제(여러 개)",
            description = "태그 ID 목록을 받아 여러 태그를 삭제합니다. (본인 소유 태그만 삭제 가능)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "삭제 성공"),
            @ApiResponse(responseCode = "400", description = "요청 값 오류"),
            @ApiResponse(responseCode = "401", description = "인증 실패(JWT 누락/만료)"),
            @ApiResponse(responseCode = "404", description = "대상이 없거나 접근 불가")
    })
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping
    public ResponseEntity<Void> delete(
            @Parameter(hidden = true)
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody List<Long> tagIds // tagIds: 삭제할 태그 ID 목록
    ) {
        Long userId = principal.getId();
        tagService.delete(tagIds, userId);
        return ResponseEntity.noContent().build();
    }
}
