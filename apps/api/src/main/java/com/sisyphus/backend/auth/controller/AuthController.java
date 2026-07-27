package com.sisyphus.backend.auth.controller;

import com.sisyphus.backend.auth.dto.*;
import com.sisyphus.backend.security.jwt.JwtTokenProvider;
import com.sisyphus.backend.auth.service.AuthService;
import com.sisyphus.backend.auth.service.EmailAuthService;
import com.sisyphus.backend.auth.token.TokenResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Auth", description = "인증/회원가입/토큰(Access/Refresh) 및 이메일 인증 API")
@RequestMapping("/api/auth")
@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmailAuthService emailAuthService;

    @Operation(
            summary = "회원가입",
            description = """
                회원가입을 수행하고, Access Token은 응답 바디(TokenResponse.accessToken)로 반환합니다.
                Refresh Token은 HttpOnly 쿠키로 내려갑니다(Set-Cookie).
                """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "회원가입 성공 (AccessToken 바디 반환 + RefreshToken 쿠키 설정)"),
            @ApiResponse(responseCode = "400", description = "요청 값 검증 실패"),
            @ApiResponse(responseCode = "409", description = "이미 가입된 사용자/이메일 등 충돌"),
            @ApiResponse(responseCode = "401", description = "연결된 사용자 정보가 없거나 인증 관련 오류")
    })
    @PostMapping("/signup")
    public ResponseEntity<TokenResponse> signup(
            @Valid @RequestBody RegisterRequest request // request: 회원가입 요청 DTO
    ) {
        TokenWithRefresh signupResult = authService.signup(request);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, signupResult.getRefreshCookie().toString())
                .body(new TokenResponse(signupResult.getAccessToken()));
    }

    @Operation(
            summary = "로그인",
            description = """
                로그인 후 Access Token은 응답 바디(TokenResponse.accessToken)로 반환합니다.
                Refresh Token은 HttpOnly 쿠키로 내려갑니다(Set-Cookie).
                """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그인 성공 (AccessToken 바디 반환 + RefreshToken 쿠키 설정)"),
            @ApiResponse(responseCode = "400", description = "요청 값 검증 실패"),
            @ApiResponse(responseCode = "401", description = "아이디/비밀번호 불일치 등 인증 실패")
    })
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(
            @Valid @RequestBody LoginRequest request // request: 로그인 요청 DTO
    ) {
        TokenWithRefresh loginResult = authService.login(request);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, loginResult.getRefreshCookie().toString())
                .body(new TokenResponse(loginResult.getAccessToken()));
    }

    @Operation(
            summary = "Chrome extension local login",
            description = "Authenticates the extension without issuing a durable refresh-token cookie."
    )
    @PostMapping("/extension/login")
    public ResponseEntity<TokenResponse> loginExtension(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(new TokenResponse(authService.loginExtension(request)));
    }

    @Operation(
            summary = "AccessToken 재발급 (Refresh)",
            description = """
                RefreshToken 쿠키를 사용해 AccessToken을 재발급합니다.
                - RefreshToken은 HttpOnly 쿠키에서 읽습니다.
                - Redis(또는 서버 저장소)에 refreshToken 유효성 검증 후 재발급합니다.
                """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "재발급 성공 (새 AccessToken 바디 반환)"),
            @ApiResponse(responseCode = "401", description = "RefreshToken 쿠키 누락/만료/무효")
    })
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(
            @Parameter(
                    description = "HttpOnly RefreshToken 쿠키(서버가 자동으로 읽습니다). 보통 Swagger에서 직접 입력하기보단 브라우저 쿠키로 테스트합니다."
            )
            @CookieValue(name = JwtTokenProvider.REFRESH_TOKEN_COOKIE_NAME, required = false)
            String refreshToken // refreshToken: HttpOnly Cookie 값
    ) {
        String newAccessToken = authService.refreshAccessToken(refreshToken);
        return ResponseEntity.ok(new TokenResponse(newAccessToken));
    }

    @Operation(
            summary = "Chrome extension OAuth code exchange",
            description = "Exchanges a short-lived, single-use authorization code using an S256 PKCE verifier."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Exchange succeeded (AccessToken body returned)"),
            @ApiResponse(responseCode = "401", description = "Code is invalid, expired, reused, or PKCE validation failed")
    })
    @PostMapping("/extension/token")
    public ResponseEntity<TokenResponse> exchangeExtensionCode(
            @Valid @RequestBody ExtensionTokenExchangeRequest request
    ) {
        return ResponseEntity.ok(new TokenResponse(authService.exchangeExtensionCode(request)));
    }

    @Operation(
            summary = "로그아웃",
            description = """
                - 서버 저장소(예: Redis)에 저장된 RefreshToken을 삭제(무효화)합니다.
                - 클라이언트의 RefreshToken 쿠키도 즉시 삭제(Set-Cookie 만료)합니다.
                """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "로그아웃 성공 (RefreshToken 쿠키 삭제)"),
            @ApiResponse(responseCode = "204", description = "RefreshToken이 유효하지 않더라도 쿠키 삭제는 진행 (Idempotent)")
    })
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = JwtTokenProvider.REFRESH_TOKEN_COOKIE_NAME, required = false)
            String refreshToken // refreshToken: HttpOnly Cookie 값(없을 수도 있음)
    ) {
        ResponseCookie deleteCookie = authService.logout(refreshToken);

        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .build();
    }

    @Operation(
            summary = "이메일 중복 확인",
            description = "이메일이 이미 사용 중인지 여부를 반환합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "확인 성공 (true: 사용 중, false: 사용 가능)"),
            @ApiResponse(responseCode = "400", description = "요청 값 검증 실패")
    })
    @PostMapping("/check")
    public ResponseEntity<Boolean> check(
            @Valid @RequestBody EmailRequest request // request.email 사용
    ) {
        boolean rs = authService.check(request.getEmail());
        return ResponseEntity.ok(rs);
    }

    @Operation(
            summary = "이메일 인증 코드 발송",
            description = "입력한 이메일로 인증 코드를 발송합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "발송 성공"),
            @ApiResponse(responseCode = "400", description = "요청 값 검증 실패")
    })
    @PostMapping("/send-email")
    public ResponseEntity<String> sendVerificationCode(
            @Valid @RequestBody EmailRequest request
    ) {
        emailAuthService.sendCodeToEmail(request.getEmail());
        return ResponseEntity.ok("인증 코드가 전송되었습니다.");
    }

    @Operation(
            summary = "이메일 인증 코드 검증",
            description = "이메일과 인증 코드를 검증합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "검증 결과 반환 (true/false)"),
            @ApiResponse(responseCode = "400", description = "요청 값 검증 실패")
    })
    @PostMapping("/verify-email")
    public ResponseEntity<Boolean> verifyCode(
            @Valid @RequestBody EmailVerifyRequest request
    ) {
        boolean isValid = emailAuthService.verifyCode(request.getEmail(), request.getCode());
        return ResponseEntity.ok(isValid);
    }
}
