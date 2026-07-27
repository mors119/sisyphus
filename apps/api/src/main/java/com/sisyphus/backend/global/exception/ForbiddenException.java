package com.sisyphus.backend.global.exception;

import com.sisyphus.backend.global.error.ApiErrorCode;
import org.springframework.http.HttpStatus;

public class ForbiddenException extends BaseException {

    public ForbiddenException(String message) {
        super(message);
    }

    @Override public HttpStatus getStatus() { return HttpStatus.FORBIDDEN; }
    @Override public ApiErrorCode getCode() { return ApiErrorCode.FORBIDDEN; }
}
