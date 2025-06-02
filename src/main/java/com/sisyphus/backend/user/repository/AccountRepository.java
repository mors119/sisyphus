package com.sisyphus.backend.user.repository;

import com.sisyphus.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<User, Long> {

}
