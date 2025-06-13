package com.sisyphus.backend.note.util;

public enum NoteCategory {
    WORD,
    NOTE,
    TODO;

    public static NoteCategory fromString(String value) {
        try {
            return NoteCategory.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            return NOTE; // 기본값 or throw new CustomException("카테고리 오류") 등 처리 가능
        }
    }
}