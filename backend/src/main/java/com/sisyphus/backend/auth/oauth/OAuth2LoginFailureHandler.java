package com.sisyphus.backend.auth.oauth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

// OAuth 실패 시 서버에 로그 찍기
@Component
public class OAuth2LoginFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {

        System.out.println("OAuth2 로그인 실패: " + exception.getMessage());
        exception.printStackTrace(); // 콘솔에 자세한 에러 로그 찍힘

        // 다시 로그인 페이지로 이동
        response.sendRedirect("/login?error");
    }
}
