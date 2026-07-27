package com.sisyphus.backend.auth.controller;

import com.sisyphus.backend.auth.service.OAuthLinkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

/**
 * OAuth 인증 시작(리다이렉트) 컨트롤러
 *
 * - /api/auth/{provider} 로 진입하면 Spring Security OAuth2의
 *   /oauth2/authorization/{provider} 로 302 리다이렉트합니다.
 * - mode 파라미터에 따라 세션에 상태값을 저장하여,
 *   OAuth 콜백(성공 핸들러)에서 "로그인 vs 계정 연결(link) vs 확장프로그램(extension)"을 분기할 수 있게 합니다.
 */
@Tag(name = "Auth", description = "OAuth 인증 시작(리다이렉트) API")
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class OAuthLinkController {

    private final OAuthLinkService oauthLinkService;

    /**
     * OAuth 제공자 목록
     *
     * - @PathVariable OAuthProvider provider 형태로 받으면
     *   허용되지 않은 문자열이 들어올 때 Spring이 400으로 처리합니다.
     * - 값은 /oauth2/authorization/{provider} 경로와 일치해야 합니다.
     */
    public enum OAuthProvider {
        google
        // naver, kakao: temporarily disabled
    }

    @Operation(
            summary = "OAuth 인증 시작(Provider Redirect)",
            description = """
                provider(google)에 따라 /oauth2/authorization/{provider} 로 302 리다이렉트합니다.

                - mode 미지정: 일반 로그인 플로우로 간주
                - mode=link: userId를 세션에 저장하여 '계정 연결' 플로우에서 사용
                - mode=extension: redirectedUri를 세션에 저장하여 OAuth 완료 후 확장프로그램으로 복귀 처리
                """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "302", description = "OAuth 인증 엔드포인트로 리다이렉트"),
            @ApiResponse(responseCode = "400", description = "provider 또는 mode/파라미터 조합 오류")
    })
    @GetMapping("/{provider}")
    public void redirectToProvider(
            HttpServletRequest request,
            HttpServletResponse response,
            @Parameter(description = "OAuth 제공자", example = "google")
            @PathVariable OAuthProvider provider,
            @Parameter(description = "동작 모드 (link | extension)", example = "link")
            @RequestParam(required = false) String mode,
            @Parameter(description = "계정 연결 시 대상 사용자 ID (mode=link 필수)", example = "123")
            @RequestParam(required = false) String userId,
            @Parameter(description = "extension 모드에서 OAuth 완료 후 복귀할 URI (mode=extension 필수)", example = "chrome-extension://xxxx/index.html")
            @RequestParam(required = false) String redirectedUri,
            @Parameter(description = "extension 모드의 S256 PKCE challenge")
            @RequestParam(required = false) String codeChallenge,
            @Parameter(description = "PKCE challenge method (S256)")
            @RequestParam(required = false) String codeChallengeMethod
    ) throws IOException {
        oauthLinkService.startOAuthFlow(
                request,
                response,
                provider.name(),
                mode,
                userId,
                redirectedUri,
                codeChallenge,
                codeChallengeMethod
        );
    }
}
