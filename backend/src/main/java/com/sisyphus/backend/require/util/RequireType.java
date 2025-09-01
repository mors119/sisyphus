package com.sisyphus.backend.require.util;

public enum RequireType {
    BUG,
    NEW;

    public static RequireType from(String raw) {
        if (raw == null) throw new IllegalArgumentException("requireType is required");
        try {
            return RequireType.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid requireType: " + raw + " (allowed: BUG, FEATURE)");
        }
    }
}
