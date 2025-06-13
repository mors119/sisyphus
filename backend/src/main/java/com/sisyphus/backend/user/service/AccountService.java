package com.sisyphus.backend.user.service;

import com.sisyphus.backend.tag.entity.Tag;
import com.sisyphus.backend.tag.repository.TagRepository;
import com.sisyphus.backend.user.dto.UserRequest;
import com.sisyphus.backend.user.entity.Account;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.exception.UserNotFoundException;
import com.sisyphus.backend.user.repository.AccountRepository;
import com.sisyphus.backend.user.repository.UserRepository;
import com.sisyphus.backend.user.util.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    //Oauth 로그인/가입
    @Transactional
    public UserRequest saveOrGetAccount(String email, String name, String provider) {
        Optional<Account> existing = accountRepository.findByEmailAndProvider(email, provider);

        if (existing.isPresent()) {
            Account account = existing.get();
            User user = Optional.ofNullable(account.getUser()) // Optional.ofNullable: null을 Optional로 감쌈
                    .orElseThrow(UserNotFoundException::new);

            UserRequest userRequest = new UserRequest();
            userRequest.setId(user.getId());
            userRequest.setEmail(user.getEmail());
            return userRequest;
        }

        // 최초 1명만 ADMIN 부여
        boolean isFirstUser = userRepository.count() == 0;
        Role role = isFirstUser ? Role.ADMIN : Role.USER;


        // 이메일로 User 먼저 찾기 (존재할 수도 있음)
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User(email,  name, role); // passwordHash는 null

                    User saveUser = userRepository.save(newUser);

                    // 최소 생성 시 기본 태그 생성
                    List<Tag> defaultTags = Tag.createDefaultTags(saveUser);
                    tagRepository.saveAll(defaultTags);

                    return saveUser;
                });

        // Account 생성 및 user 연결
        Account account = Account.ofOauth(email, name, provider);
        account.linkToUser(user); // 핵심
        accountRepository.save(account);

        UserRequest userRequest = new UserRequest();
        userRequest.setEmail(user.getEmail());
        userRequest.setId(user.getId());

        return userRequest;
    }
}
