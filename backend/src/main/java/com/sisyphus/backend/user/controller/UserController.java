package com.sisyphus.backend.user.controller;

import com.sisyphus.backend.auth.jwt.JwtTokenHandler;
import com.sisyphus.backend.user.dto.UserNameRequest;
import com.sisyphus.backend.user.dto.UserResponse;
import com.sisyphus.backend.user.dto.UserWithAccountResponse;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/user")
@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtTokenHandler jwtTokenHandler ;

    // user 정보 가져오기
    @PostMapping("/read")
    public ResponseEntity<UserResponse> readUserInfo(HttpServletRequest request) {
        Long userId = jwtTokenHandler.extractUserIdFromRequest(request);
        User user = userService.findById(userId);

        return ResponseEntity.ok(new UserResponse(user));
    }

    // 유저 상세 페이지
    @PostMapping("/detail")
    public ResponseEntity<UserWithAccountResponse> getUserDetail(HttpServletRequest request) {
        Long userId = jwtTokenHandler.extractUserIdFromRequest(request);
        UserWithAccountResponse dto = userService.getUserWithAccounts(userId);
        return ResponseEntity.ok(dto);
    }

    // user 삭제
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteUser(HttpServletRequest request) {
        Long userId = jwtTokenHandler.extractUserIdFromRequest(request);

        userService.deleteUser(userId);
        return ResponseEntity.noContent().build(); // HTTP 204 No Content
    }

//   TODO: user/update 시 401 보안 개선
    @PutMapping("/update")
    public ResponseEntity<Void> updateUser(
            HttpServletRequest request,
            @RequestBody UserNameRequest userRequest
    ) {
        Long userId = jwtTokenHandler.extractUserIdFromRequest(request);

        userService.updateUser(userId, userRequest);

        return ResponseEntity.ok().build();
    }
}
