package com.sisyphus.backend.auth.oauth;


import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;

// 네이버, 카카오 로그인에 필요
@Component
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId(); // google, naver, kakao 출력
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // Naver 사용자 정보는 'response' 안에 있음
        if ("naver".equals(registrationId)) {
            // Naver는 응답이 response 안에 들어 있음
            attributes = extractAttributesSafely(attributes.get("response")); // email, name 등이 들어있는 Map으로 교체
        }

        if ("kakao".equals(registrationId)) {
            Map<String, Object> kakaoAccount = extractAttributesSafely(attributes.get("kakao_account"));
            Map<String, Object> profile = extractAttributesSafely(kakaoAccount.get("profile"));

            attributes = Map.of(
                    "email", kakaoAccount.get("email"),
                    "name", profile.get("nickname")
            );
        }

        // 'email'을 usernameAttribute로 지정
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                attributes,
                "email"  // Naver도 email이 있어야 동작
        );
    }

    /**
     * 주어진 객체가 Map인지 확인하고, Map일 경우 String 타입의 키를 가진 속성들을 추출하여
     * 새로운 Map<String, Object>로 반환합니다.
     * 입력 객체가 Map이 아니거나, 키가 String 타입이 아닌 엔트리가 있을 경우 해당 엔트리는 무시됩니다.
     *
     * @param raw 확인할 객체
     * @return String 타입의 키를 가진 속성들을 담은 Map (입력 객체가 Map이 아니면 빈 Map 반환)
     */
//    @SuppressWarnings("unchecked")
    private Map<String, Object> extractAttributesSafely(Object raw) {
        if (raw instanceof Map<?, ?> map) {
            return map.entrySet().stream()
                    .filter(e -> e.getKey() instanceof String)
                    .collect(
                            java.util.stream.Collectors.toMap(
                                    e -> (String) e.getKey(),
                                    Map.Entry::getValue
                            )
                    );
        }
        return Collections.emptyMap();
    }
}
