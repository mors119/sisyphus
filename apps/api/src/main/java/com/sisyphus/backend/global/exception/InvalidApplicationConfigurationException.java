package com.sisyphus.backend.global.exception;

import com.sisyphus.backend.global.error.ApiErrorCode;
import org.springframework.http.HttpStatus;

public class InvalidApplicationConfigurationException extends BaseException {

    public InvalidApplicationConfigurationException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    @Override
    public ApiErrorCode getCode() {
        return ApiErrorCode.INTERNAL_SERVER_ERROR;
    }
}
