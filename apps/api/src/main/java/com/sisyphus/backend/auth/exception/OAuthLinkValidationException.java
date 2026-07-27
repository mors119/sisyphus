package com.sisyphus.backend.auth.exception;

import com.sisyphus.backend.global.error.ApiErrorCode;
import com.sisyphus.backend.global.exception.BaseException;
import org.springframework.http.HttpStatus;

public class OAuthLinkValidationException extends BaseException {

    public OAuthLinkValidationException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.BAD_REQUEST;
    }

    @Override
    public ApiErrorCode getCode() {
        return ApiErrorCode.VALIDATION_ERROR;
    }
}
