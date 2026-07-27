package com.sisyphus.backend.auth.exception;

import com.sisyphus.backend.global.error.ApiErrorCode;
import com.sisyphus.backend.global.exception.BaseException;
import org.springframework.http.HttpStatus;

public class EmailVerificationConflictException extends BaseException {

    public EmailVerificationConflictException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.CONFLICT;
    }

    @Override
    public ApiErrorCode getCode() {
        return ApiErrorCode.CONFLICT;
    }
}
