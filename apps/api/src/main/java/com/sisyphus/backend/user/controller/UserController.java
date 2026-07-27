package com.sisyphus.backend.user.controller;

import com.sisyphus.backend.security.principal.UserPrincipal;
import com.sisyphus.backend.user.dto.CountsResponse;
import com.sisyphus.backend.user.dto.UserNameRequest;
import com.sisyphus.backend.user.dto.UserResponse;
import com.sisyphus.backend.user.dto.UserWithAccountResponse;
import com.sisyphus.backend.user.service.AccountService;
import com.sisyphus.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "User", description = "유저 정보/프로필/계정 연결 조회 API")
@RequestMapping("/api/user")
@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AccountService accountService;

    @Operation(
            summary = "내 유저 정보 조회",
            description = "현재 로그인한 사용자(User)의 기본 정보를 반환합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패(JWT 누락/만료)")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/read")
    public ResponseEntity<UserResponse> readUserInfo(
            @Parameter(hidden = true)
            @AuthenticationPrincipal UserPrincipal principal // principal: 인증된 사용자
    ) {
        Long userId = principal.getId();
        return ResponseEntity.ok(userService.getUserResponse(userId));
    }

    @Operation(
            summary = "내 유저 상세 조회(계정 연결 포함)",
            description = "현재 로그인한 사용자(User)와 연결된 OAuth 계정 목록을 포함한 상세 정보를 반환합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패(JWT 누락/만료)")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/detail")
    public ResponseEntity<UserWithAccountResponse> getUserDetail(
            @Parameter(hidden = true)
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal.getId();
        UserWithAccountResponse dto = userService.getUserWithAccounts(userId);
        return ResponseEntity.ok(dto);
    }

    @Operation(
            summary = "내 계정 삭제",
            description = "현재 로그인한 사용자 계정을 삭제합니다. (데이터 삭제 정책에 따라 soft delete/hard delete 여부는 서비스 정책을 따릅니다.)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "삭제 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패(JWT 누락/만료)")
    })
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteUser(
            @Parameter(hidden = true)
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal.getId();
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "내 프로필 수정(이름 변경)",
            description = "현재 로그인한 사용자 프로필(예: 이름)을 수정합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "400", description = "요청 값 검증 실패"),
            @ApiResponse(responseCode = "401", description = "인증 실패(JWT 누락/만료)")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/update")
    public ResponseEntity<Void> updateUser(
            @Parameter(hidden = true)
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody @Valid UserNameRequest userRequest // userRequest: 수정 요청 DTO
    ) {
        Long userId = principal.getId();
        userService.updateUser(userId, userRequest);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "유저 카운트 조회 (ADMIN)",
            description = "관리자 권한(ADMIN)에서 전체 유저 수(또는 집계)를 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패(JWT 누락/만료)"),
            @ApiResponse(responseCode = "403", description = "권한 없음(ADMIN 전용)")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/count")
    public ResponseEntity<CountsResponse> getUserCount() {
        return ResponseEntity.ok(accountService.getUserCount());
    }
}
