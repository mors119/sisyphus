package com.sisyphus.backend.global.exception;

import com.sisyphus.backend.user.util.Provider;
import lombok.Getter;

@Getter
public class OAuthAccountAlreadyLinkedException extends RuntimeException {
    private final Provider provider;

    public OAuthAccountAlreadyLinkedException(Provider provider) {
        super("이미 연동된 " + provider + " 계정입니다.");
        this.provider = provider;
    }

}