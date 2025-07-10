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

    /**
     * OAuth2 로그인 성공 후 사용자 정보를 로딩하고 필요한 형태로 가공하여 반환합니다.
     * <p>
     * Spring Security의 {@link org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService}
     * 를 확장한 메서드로, {@link OAuth2UserRequest}를 기반으로 공급자(Naver, Kakao, Google 등)에 따라
     * 사용자 프로필 정보를 적절히 파싱하여 {@link OAuth2User} 객체로 변환합니다.
     * </p>
     *
     * @param userRequest OAuth2 인증 과정에서 전달된 사용자 요청 객체
     *                    - clientRegistration: 어떤 OAuth 공급자(google/naver/kakao)인지 정보 포함
     *                    - accessToken: 사용자 인증을 통해 받은 액세스 토큰
     * @return OAuth2User 사용자 인증 정보를 담은 객체 (Spring Security 내부적으로 사용됨)
     *         - attributes: 사용자 정보 Map (email, name 등)
     *         - authorities: 기본으로 ROLE_USER 설정
     *         - nameAttributeKey: 사용자 ID로 사용할 속성 키 (email)
     * @throws OAuth2AuthenticationException 사용자 정보 로딩에 실패할 경우 발생
     */
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // Spring이 기본적으로 제공하는 사용자 정보 로더 실행
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 어떤 OAuth 공급자인지 식별 (예: google, naver, kakao)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        // 공급자로부터 받은 원본 사용자 정보
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // Naver는 사용자 정보가 'response' 키 하위에 JSON 객체로 제공됨
        if ("naver".equals(registrationId)) {
            // 예: { "response": { "email": "...", "name": "..." } }
            attributes = extractAttributesSafely(attributes.get("response"));
        }

        // Kakao는 사용자 정보가 "kakao_account" 하위에 위치
        if ("kakao".equals(registrationId)) {
            Map<String, Object> kakaoAccount = extractAttributesSafely(attributes.get("kakao_account"));
            Map<String, Object> profile = extractAttributesSafely(kakaoAccount.get("profile"));

            // email과 name 정보를 뽑아서 새로 attributes 맵 구성
            attributes = Map.of(
                    "email", kakaoAccount.get("email"),
                    "name", profile.get("nickname")
            );
        }

        // 모든 공급자에서 'email'을 nameAttributeKey로 지정 (Principal의 이름 역할)
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")), // 권한은 기본으로 ROLE_USER
                attributes, // 사용자 정보
                "email"     // SecurityContext에서 사용할 ID 속성
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
