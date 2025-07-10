package com.sisyphus.backend.user.util;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;

public enum Provider {
    GOOGLE, NAVER, KAKAO, CAMUS;

    /**
     * 문자열을 대소문자 무관하게 Provider enum으로 변환
     * 유효하지 않으면 IllegalArgumentException 발생
     */
    @JsonCreator
    public static Provider from(String value) {
        return Arrays.stream(Provider.values())
                .filter(p -> p.name().equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid provider: " + value));
    }
}
