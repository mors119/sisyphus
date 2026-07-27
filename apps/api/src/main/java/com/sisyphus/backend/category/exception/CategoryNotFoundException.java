package com.sisyphus.backend.category.exception;

import com.sisyphus.backend.global.error.ApiErrorCode;
import com.sisyphus.backend.global.exception.BaseException;
import org.springframework.http.HttpStatus;

public class CategoryNotFoundException extends BaseException {

    public CategoryNotFoundException() {
        super("해당 카테고리를 찾을 수 없습니다.");
    }

    @Override public HttpStatus getStatus() { return HttpStatus.NOT_FOUND; }
    @Override public ApiErrorCode getCode() { return ApiErrorCode.NOT_FOUND; }
}
