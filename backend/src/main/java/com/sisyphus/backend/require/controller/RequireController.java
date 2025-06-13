package com.sisyphus.backend.require.controller;

import com.sisyphus.backend.auth.jwt.JwtTokenProvider;
import com.sisyphus.backend.require.dto.RequireRequest;
import com.sisyphus.backend.require.dto.RequireResponse;
import com.sisyphus.backend.require.service.RequireService;
import com.sisyphus.backend.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/require")
public class RequireController {

    private final RequireService requireService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    // 등록
    @PostMapping("/create")
    public ResponseEntity<RequireResponse> createRequire(
            @RequestBody RequireRequest requestDto,
            HttpServletRequest request
    ) {
        Long userId = jwtTokenProvider.getUserId(jwtTokenProvider.resolveToken(request));
        RequireResponse response = requireService.create(userId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response); // ResponseEntity.ok().build()도 가능. 하지만 body 가 있는걸 많이씀 
    }

    // 전체 조회 ()
    @GetMapping("/readAll")
    public ResponseEntity<Page<RequireResponse>> getMyRequires(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            HttpServletRequest request
    ) {
        Long userId = jwtTokenProvider.getUserId(jwtTokenProvider.resolveToken(request));
        Page<RequireResponse> page = requireService.getRequiresByUser(userId, pageable);
        return ResponseEntity.ok(page);
    }

//    @GetMapping("/readRequires")
//    public ResponseEntity<PageResponse<RequireResponse>> getRequires(
//            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
//            HttpServletRequest request
//    ) {
//        Long userId = jwtTokenProvider.getUserId(jwtTokenProvider.resolveToken(request));
//        Page<RequireResponse> page = requireService.getRequires(userId, pageable);
//        return ResponseEntity.ok(new PageResponse<>(page));
//    }


    // 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<RequireResponse> getRequireById(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        Long userId = jwtTokenProvider.getUserId(jwtTokenProvider.resolveToken(request));
        RequireResponse response = requireService.getRequireById(userId, id);
        return ResponseEntity.ok(response);
    }

//    // 수정
//    @PutMapping("/{id}")
//    public ResponseEntity<RequireResponse> updateRequire(
//            @PathVariable Long id,
//            @RequestBody RequireRequest requestDto,
//            HttpServletRequest request
//    ) {
//        Long userId = jwtTokenProvider.getUserId(jwtTokenProvider.resolveToken(request));
//        RequireResponse response = requireService.update(userId, id, requestDto);
//        return ResponseEntity.ok(response);
//    }
//
//    // 삭제
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteRequire(
//            @PathVariable Long id,
//            HttpServletRequest request
//    ) {
//        Long userId = jwtTokenProvider.getUserId(jwtTokenProvider.resolveToken(request));
//        requireService.delete(userId, id);
//        return ResponseEntity.noContent().build();
//    }
}