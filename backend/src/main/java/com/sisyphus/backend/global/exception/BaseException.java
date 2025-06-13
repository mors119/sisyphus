package com.sisyphus.backend.global.exception;

import org.springframework.http.HttpStatus;

public abstract class BaseException extends RuntimeException {

    protected BaseException(String message) {
        super(message);
    }

    public abstract HttpStatus getStatus();
}

