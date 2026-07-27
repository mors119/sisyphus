package com.sisyphus.backend.auth.controller;

import com.sisyphus.backend.global.props.AppProps;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

/**
 * OAuth 인증 시작(리다이렉트) 컨트롤러
 *
 * - /api/auth/{provider} 로 진입하면 Spring Security OAuth2의
 *   /oauth2/authorization/{provider} 로 302 리다이렉트합니다.
 * - mode 파라미터에 따라 "세션(Session)"에 상태값을 저장하여,
 *   OAuth 콜백(성공 핸들러)에서 "로그인 vs 계정 연결(link) vs 확장프로그램(extension)"을 분기할 수 있게 합니다.
 */
@Tag(name = "Auth", description = "OAuth 인증 시작(리다이렉트) API")
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class OAuthLinkController {

    private final AppProps appProps;

    // ----- Session keys -----
    private static final String SESSION_KEY_MODE = "mode";
    private static final String SESSION_KEY_USER_ID = "userId";
    private static final String SESSION_KEY_REDIRECT_URI = "redirectedUri";

    // ----- Modes -----
    private static final String MODE_LINK = "link";
    private static final String MODE_EXTENSION = "extension";

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

    /**
     * OAuth 시작 엔드포인트
     *
     * @param request HttpServletRequest (세션 저장에 사용)
     * @param response HttpServletResponse (302 리다이렉트에 사용)
     * @param provider OAuth 제공자 (google)
     * @param mode 동작 모드: null(기본 로그인) | link(계정 연결) | extension(확장프로그램)
     * @param userId mode=link 일 때 연결 대상 사용자 ID(필수)
     * @param redirectedUri mode=extension 일 때 OAuth 완료 후 복귀할 URI(필수)
     *
     * @throws IOException response.sendRedirect 호출 시 예외 가능
     */
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
            @RequestParam(required = false) String redirectedUri
    ) throws IOException {

        validateParams(mode, userId, redirectedUri);
        persistSessionAttributes(request, mode, userId, redirectedUri);

        // 프론트 dev proxy 뒤에서도 백엔드 OAuth 엔드포인트로 안정적으로 이동하도록 절대 URL 사용
        response.sendRedirect(appProps.hosts().api() + "/oauth2/authorization/" + provider.name());
    }

    /**
     * 세션에 필요한 상태값을 저장합니다.
     *
     * - link 모드: (mode, userId) 저장
     * - extension 모드: (mode, redirectedUri) 저장
     *
     * @param request HttpServletRequest
     * @param mode String | null
     * @param userId String | null
     * @param redirectedUri String | null
     */
    private void persistSessionAttributes(
            HttpServletRequest request,
            String mode,
            String userId,
            String redirectedUri
    ) {
        if (mode == null) return;

        if (MODE_LINK.equals(mode)) {
            request.getSession().setAttribute(SESSION_KEY_MODE, MODE_LINK);
            request.getSession().setAttribute(SESSION_KEY_USER_ID, userId);
            return;
        }

        if (MODE_EXTENSION.equals(mode)) {
            request.getSession().setAttribute(SESSION_KEY_MODE, MODE_EXTENSION);
            request.getSession().setAttribute(SESSION_KEY_REDIRECT_URI, redirectedUri);
        }
    }

    /**
     * mode와 파라미터 조합을 검증합니다.
     *
     * 규칙:
     * - mode가 null이면: 일반 로그인 플로우
     * - mode=link이면: userId 필수
     * - mode=extension이면: redirectedUri 필수
     *
     * @param mode String | null
     * @param userId String | null
     * @param redirectedUri String | null
     */
    private void validateParams(String mode, String userId, String redirectedUri) {
        if (mode == null) return;

        if (MODE_LINK.equals(mode)) {
            if (userId == null || userId.isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "mode=link requires userId"
                );
            }
            return;
        }

        if (MODE_EXTENSION.equals(mode)) {
            if (redirectedUri == null || redirectedUri.isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "mode=extension requires redirectedUri"
                );
            }
            return;
        }

        // 그 외는 모두 잘못된 mode
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid mode: " + mode
        );
    }
}
