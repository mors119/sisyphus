package com.sisyphus.backend.user.service;

import com.sisyphus.backend.user.dto.UserWithAccountResponse;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.exception.UserNotFoundException;
import com.sisyphus.backend.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // 아이디 찾기
    public User findById(Long userId) {
        return userRepository.findById(userId)
//                .orElse(null); null 처리 비권장 예외 처리가 나음
                .orElseThrow(UserNotFoundException::new);
    }

    // User id와 일치하는 account 정보
    @Transactional(readOnly = true)
    public UserWithAccountResponse getUserWithAccounts(Long userId) {
        User user = userRepository.findWithAccountsById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserWithAccountResponse.AccountInfo> accounts = user.getAccounts().stream()
                .map(acc -> new UserWithAccountResponse.AccountInfo(
                        acc.getId(),
                        acc.getEmail(),
                        acc.getProvider()
                ))
                .toList();

        return new UserWithAccountResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getCreatedAt(),
                accounts
        );
    }

    // User Id로 지우기(token에 user id 들어있도록!)
    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("User not found");
        }
        userRepository.deleteById(userId);
    }
}