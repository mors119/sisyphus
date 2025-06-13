package com.sisyphus.backend.user.repository;

import com.sisyphus.backend.user.entity.Account;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    // email 확인
    boolean existsByEmail(String email);

    // email과 provider로 찾기
    Optional<Account> findByEmailAndProvider(@NotBlank(message = "{auth.email.blank}") @Email(message = "{auth.email.invalid}") String email, String provider);

    // 일반 로그인 시 지연 오류 방지 : LazyInitializationException 방지
    @Query("SELECT a FROM Account a JOIN FETCH a.user WHERE a.email = :email AND a.provider = :provider")
    Optional<Account> findByEmailAndProviderFetchUser(@Param("email") String email, @Param("provider") String provider);

    boolean existsByEmailAndProvider(@NotBlank(message = "{auth.email.blank}") @Email(message = "{auth.email.invalid}") String email, String camus);
}
