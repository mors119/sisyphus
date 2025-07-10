package com.sisyphus.backend.user.dto;

import com.sisyphus.backend.user.util.Provider;

import java.time.LocalDateTime;
import java.util.List;

public record UserWithAccountResponse(
        Long userId,
        String userEmail,
        String userName,
        LocalDateTime createdAt,
        List<AccountInfo> accounts
) {
    public record AccountInfo(
            Long accountId,
            String email,
            Provider provider
    ) {}
}
