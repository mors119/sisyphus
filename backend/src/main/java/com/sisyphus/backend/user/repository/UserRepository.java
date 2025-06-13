package com.sisyphus.backend.user.repository;

import com.sisyphus.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // email 정보 가져 오기
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u JOIN FETCH u.accounts WHERE u.id = :userId")
    Optional<User> findWithAccountsById(@Param("userId") Long userId);

    // id로 삭제하기
    void deleteById(Long id);
}
