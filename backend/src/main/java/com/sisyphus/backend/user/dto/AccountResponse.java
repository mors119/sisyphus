package com.sisyphus.backend.user.dto;

import com.sisyphus.backend.user.entity.Account;
import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public class AccountResponse {
    private final Long id;
    private final String name;
    private final String email;
    private final String provider;

    public AccountResponse(Account account) {
        this.id = account.getId();
        this.name = account.getName();
        this.email = account.getEmail();
        this.provider = account.getProvider();
    }

}
