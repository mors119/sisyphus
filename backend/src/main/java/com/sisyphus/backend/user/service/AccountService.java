package com.sisyphus.backend.user.service;

import com.sisyphus.backend.category.entity.Category;
import com.sisyphus.backend.category.repository.CategoryRepository;
import com.sisyphus.backend.global.exception.OAuthAccountAlreadyLinkedException;
import com.sisyphus.backend.user.dto.CountsResponse;
import com.sisyphus.backend.user.dto.UserRequest;
import com.sisyphus.backend.user.entity.Account;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.exception.UserNotFoundException;
import com.sisyphus.backend.user.repository.AccountRepository;
import com.sisyphus.backend.user.repository.UserRepository;
import com.sisyphus.backend.user.util.Provider;
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
    private final CategoryRepository categoryRepository;

    /**
     * OAuth2 로그인 또는 연동 시 사용자의 이메일, 공급자(provider)를 기준으로
     * 해당 계정(Account)을 조회하거나, 없으면 새롭게 생성하고 연결합니다.
     * <p>
     * 또한 해당 계정과 연결된 {@link User}가 없다면 새 유저를 생성하고 연동하며,
     * 최초 사용자에게는 {@link Role#ADMIN} 권한을 부여합니다.
     * </p>
     *
     * @param email    OAuth 공급자로부터 받은 사용자 이메일
     * @param name     사용자 이름 (프로필 이름)
     * @param provider OAuth 공급자 이름 (예: "google", "naver", "kakao")
     * @return {@link UserRequest} 응답 객체 (연동된 사용자 정보 포함)
     * @throws UserNotFoundException 해당 Account에 연결된 User가 없을 경우
     */
    @Transactional
    public UserRequest saveOrGetAccount(String email, String name, Provider provider) {
        // 1. 이메일 + 공급자(provider)로 기존 Account를 먼저 조회
        Optional<Account> existing = accountRepository.findByEmailAndProvider(email, provider);

        // 2. 이미 존재하면 -> 연결된 User 정보를 리턴
        if (existing.isPresent()) {
            Account account = existing.get();

            // 연결된 사용자(User)가 없는 경우 예외 발생 (정상적이라면 거의 없음)
            User user = Optional.ofNullable(account.getUser())
                    .orElseThrow(UserNotFoundException::new);

            // 응답용 DTO 구성
            UserRequest userRequest = new UserRequest();
            userRequest.setId(user.getId());
            userRequest.setEmail(user.getEmail());
            userRequest.setRole(user.getRole());

            if (user.getRole() == null) {
                userRequest.setRole(Role.USER);
            }
            return userRequest;
        }

        // 3. Account가 존재하지 않으면 → 새 User 또는 기존 User와 연결

        // 최초 사용자라면 ADMIN 권한 부여
        boolean isFirstUser = userRepository.count() == 0;
        Role role = isFirstUser ? Role.ADMIN : Role.USER;

        // 이메일로 기존 User 있는지 확인 → 없으면 새로 생성
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User(email, name, role); // password는 null
                    User savedUser = userRepository.save(newUser);

                    // 기본 태그 자동 생성
                    List<Category> defaultCategories = Category.createDefaultCategories(savedUser);
                    categoryRepository.saveAll(defaultCategories);

                    return savedUser;
                });

        // 4. Account 생성 및 User 연동
        Account account = Account.ofOauth(email, name, provider); // 정적 팩토리 메서드 사용
        account.linkToUser(user); // 핵심: Account → User 연결
        accountRepository.save(account);

        // 5. 응답 객체 생성
        UserRequest userRequest = new UserRequest();
        userRequest.setId(user.getId());
        userRequest.setEmail(user.getEmail());

        return userRequest;
    }

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

    @Transactional(readOnly = true)
    public CountsResponse getUserCount() {
        return new CountsResponse(accountRepository.count(), userRepository.count());
    }
}
