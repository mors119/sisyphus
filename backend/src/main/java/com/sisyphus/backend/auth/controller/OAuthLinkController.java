package com.sisyphus.backend.auth.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class OAuthLinkController {

    private static final String MODE = "mode";
    private static final String USER_ID = "userId";
    private static final String REDIRECT_URI = "redirectedUri";

    private static final String LINK = "link";
    private static final String EXTENSION = "extension";

    // 공통 로직 커지면 분리
    private void handleSessionAttributes(HttpServletRequest request, String mode, String userId, String redirectedUri) {
        if (LINK.equals(mode) && userId != null) {
            request.getSession().setAttribute(MODE, LINK);
            request.getSession().setAttribute(USER_ID, userId);
        }

        if (EXTENSION.equals(mode) && redirectedUri != null) {
            request.getSession().setAttribute(MODE, EXTENSION);
            request.getSession().setAttribute(REDIRECT_URI, redirectedUri);
        }
    }

    @GetMapping("/naver")
    public void redirectToNaver(
            HttpServletRequest request,
            HttpServletResponse response,
            @RequestParam(required = false) String mode,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String redirectedUri
    ) throws IOException {
        handleSessionAttributes(request, mode, userId, redirectedUri);

        response.sendRedirect("/oauth2/authorization/naver");
    }

    @GetMapping("/google")
    public void redirectToGoogle(
            HttpServletRequest request,
            HttpServletResponse response,
            @RequestParam(required = false) String mode,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String redirectedUri

    ) throws IOException {
        handleSessionAttributes(request, mode, userId, redirectedUri);

        response.sendRedirect("/oauth2/authorization/google");
    }

    @GetMapping("/kakao")
    public void redirectToKakao(
            HttpServletRequest request,
            HttpServletResponse response,
            @RequestParam(required = false) String mode,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String redirectedUri

    ) throws IOException {
        handleSessionAttributes(request, mode, userId, redirectedUri);

        response.sendRedirect("/oauth2/authorization/kakao");
    }
}