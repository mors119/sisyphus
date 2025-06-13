package com.sisyphus.backend.require.repository;

import com.sisyphus.backend.require.entity.Require;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RequireRepository extends JpaRepository<Require, Long> {

    // 해당 유저의 모든 요구사항 조회
    @EntityGraph(attributePaths = {"user", "comments"})
    Page<Require> findByUser_Id(Long userId, Pageable pageable);

    // 유저가 작성한 특정 요구사항만 조회
    @EntityGraph(attributePaths = {"user", "comments"})
    Optional<Require> findByIdAndUserId(Long id, Long userId);
}
