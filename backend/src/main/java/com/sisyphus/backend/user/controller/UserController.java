package com.sisyphus.backend.user.controller;

import com.sisyphus.backend.auth.jwt.JwtTokenProvider;
import com.sisyphus.backend.global.exception.UnauthorizedException;
import com.sisyphus.backend.user.dto.UserResponse;
import com.sisyphus.backend.user.dto.UserWithAccountResponse;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/user")
@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    // user 정보 가져오기
    @PostMapping("/read")
    public ResponseEntity<UserResponse> readUserInfo(HttpServletRequest request) {
//        String token = request.getHeader("Authorization").replace("Bearer ", ""); 아래 코드를 사용하는게 안전
        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            throw new UnauthorizedException("유효하지 않은 인증 정보입니다.");
        }
        String token = header.substring(7);

        Long userId = jwtTokenProvider.getUserId(token); // 직접 파싱
        User user = userService.findById(userId);

        return ResponseEntity.ok(new UserResponse(user));
    }

    // 유저 상세 페이지
    @PostMapping("/detail")
    public ResponseEntity<UserWithAccountResponse> getUserDetail(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);
        Long userId = jwtTokenProvider.getUserId(token);

        UserWithAccountResponse dto = userService.getUserWithAccounts(userId);
        return ResponseEntity.ok(dto);
    }

    // user 삭제
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteUser(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);
        Long userId = jwtTokenProvider.getUserId(token);

        userService.deleteUser(userId);
        return ResponseEntity.noContent().build(); // HTTP 204 No Content
    }

}
