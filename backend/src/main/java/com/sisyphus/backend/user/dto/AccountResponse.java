package com.sisyphus.backend.user.dto;

import com.sisyphus.backend.user.entity.Account;
import com.sisyphus.backend.user.util.Provider;
import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public class AccountResponse {
    private final Long id;
    private final String name;
    private final String email;
    private final Provider provider;

    public AccountResponse(Account account) {
        this.id = account.getId();
        this.name = account.getName();
        this.email = account.getEmail();
        this.provider = account.getProvider();
    }

}
