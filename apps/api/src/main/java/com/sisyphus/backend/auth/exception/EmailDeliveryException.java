package com.sisyphus.backend.auth.exception;

import com.sisyphus.backend.global.error.ApiErrorCode;
import com.sisyphus.backend.global.exception.BaseException;
import org.springframework.http.HttpStatus;

public class EmailDeliveryException extends BaseException {

    public EmailDeliveryException() {
        super("이메일 전송 실패");
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
