package com.sisyphus.backend.require.repository;

import com.sisyphus.backend.require.dto.StatusCountResponse;
import com.sisyphus.backend.require.entity.Require;
import com.sisyphus.backend.require.util.RequireStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface RequireRepository extends JpaRepository<Require, Long> {

    // 해당 유저의 모든 요구사항 조회
//    @EntityGraph(attributePaths = {"user", "comments"})
    @EntityGraph(attributePaths = {"user"})
    Page<Require> findByUser_Id(Long userId, Pageable pageable);

    // 유저가 작성한 특정 요구사항만 조회
//    @EntityGraph(attributePaths = {"user", "comments"})
    @EntityGraph(attributePaths = {"user"})
    Optional<Require> findByIdAndUserId(Long id, Long userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update Require r set r.status = :status, r.updatedAt = CURRENT_TIMESTAMP where r.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") RequireStatus status);

    // Require status count
    @Query("SELECT new com.sisyphus.backend.require.dto.StatusCountResponse(r.status, COUNT(r), MONTH(r.createdAt)) " +
            "FROM Require r " +
            "WHERE r.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY r.status, MONTH(r.createdAt) " +
            "ORDER BY MONTH(r.createdAt)")
    List<StatusCountResponse> countAllStatusesByMonth(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}
