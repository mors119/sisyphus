package com.sisyphus.backend.auth.service;


import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;

// 네이버 로그인에 필요
@Component
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId(); // google or naver
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // Naver 사용자 정보는 'response' 안에 있음
        if (registrationId.equals("naver")) {
            attributes = (Map<String, Object>) attributes.get("response");
        }

        // 'email'을 usernameAttribute로 지정
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                attributes,
                "email"  // Naver도 email이 있어야 동작
        );
    }
}
