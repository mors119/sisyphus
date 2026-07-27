package com.sisyphus.backend.user.service;

import com.sisyphus.backend.category.entity.Category;
import com.sisyphus.backend.category.repository.CategoryRepository;
import com.sisyphus.backend.global.exception.OAuthAccountAlreadyLinkedException;
import com.sisyphus.backend.user.dto.AccountUserSnapshot;
import com.sisyphus.backend.user.dto.CountsResponse;
import com.sisyphus.backend.user.entity.Account;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.exception.UserNotFoundException;
import com.sisyphus.backend.user.repository.AccountRepository;
import com.sisyphus.backend.user.repository.UserRepository;
import com.sisyphus.backend.user.util.Provider;
import com.sisyphus.backend.user.util.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
/**
 * Manages account creation, lookup, linking, and lightweight user aggregates.
 */
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Finds or creates an OAuth-backed account and ensures it is linked to a user.
     *
     * @param email OAuth provider email
     * @param name profile display name
     * @param provider OAuth provider
     * @return linked user snapshot
     * @throws UserNotFoundException when an existing account has no linked user
     */
    @Transactional
    public AccountUserSnapshot saveOrGetAccount(String email, String name, Provider provider) {
        // 1. 이메일 + 공급자(provider)로 기존 Account를 먼저 조회
        Optional<Account> existing = accountRepository.findByEmailAndProvider(email, provider);

        // 2. 이미 존재하면 -> 연결된 User 정보를 리턴
        if (existing.isPresent()) {
            Account account = existing.get();

            // 연결된 사용자(User)가 없는 경우 예외 발생 (정상적이라면 거의 없음)
            User user = Optional.ofNullable(account.getUser())
                    .orElseThrow(UserNotFoundException::new);

            return AccountUserSnapshot.from(user);
        }

        // 3. Account가 존재하지 않으면 → 새 User 또는 기존 User와 연결

        User user = findOrCreateUser(email, name);

        // 4. Account 생성 및 User 연동
        Account account = Account.ofOauth(email, name, provider); // 정적 팩토리 메서드 사용
        account.linkToUser(user); // 핵심: Account → User 연결
        accountRepository.save(account);

        return AccountUserSnapshot.from(user);
    }

    /**
     * Finds or creates a local account backed by the CAMUS provider.
     *
     * @param email local account email
     * @param name profile display name
     * @param password raw password to encode before persistence
     * @return linked user snapshot
     */
    @Transactional
    public AccountUserSnapshot saveOrGetLocalAccount(
            String email,
            String name,
            String password
    ) {
        Optional<Account> existing = accountRepository.findByEmailAndProvider(email, Provider.CAMUS);
        if (existing.isPresent()) {
            return AccountUserSnapshot.from(requireUser(existing.get()));
        }

        User user = findOrCreateUser(email, name);
        Account account = Account.ofLocal(email, name, passwordEncoder.encode(password));
        account.linkToUser(user);
        accountRepository.save(account);
        return AccountUserSnapshot.from(user);
    }

    /**
     * Links a new OAuth provider account to an existing user.
     *
     * @param userId target user id
     * @param name provider display name
     * @param email provider email
     * @param provider OAuth provider
     */
    @Transactional
    public void linkOAuthAccount(Long userId,  String name, String email, Provider provider) {

        // 1. 이메일 + 공급자(provider)로 기존 Account를 먼저 조회
        Optional<Account> existing = accountRepository.findByEmailAndProvider(email, provider);

        // 2. 이미 존재하면 -> 연결된 User 정보를 리턴
        if (existing.isPresent()) {
            throw new OAuthAccountAlreadyLinkedException(provider);
        }

        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);

        // 연동 정보 저장
        Account account = Account.ofLink(email, name, provider, user);
        accountRepository.save(account);
    }

    /**
     * Returns global account and user counts.
     *
     * @return account and user totals
     */
    @Transactional(readOnly = true)
    public CountsResponse getUserCount() {
        return new CountsResponse(accountRepository.count(), userRepository.count());
    }

    private User findOrCreateUser(String email, String name) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            Role role = userRepository.count() == 0 ? Role.ADMIN : Role.USER;
            User savedUser = userRepository.save(new User(email, name, role));
            categoryRepository.saveAll(Category.createDefaultCategories(savedUser));
            return savedUser;
        });
    }

    private User requireUser(Account account) {
        return Optional.ofNullable(account.getUser()).orElseThrow(UserNotFoundException::new);
    }
}
