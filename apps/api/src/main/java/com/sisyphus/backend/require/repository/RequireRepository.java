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
import java.util.Optional;

/**
 * Repository for loading and updating {@link Require} entities.
 */
public interface RequireRepository extends JpaRepository<Require, Long> {

    /**
     * Returns a paginated slice of requires owned by the given user.
     *
     * @param userId owner id
     * @param pageable page and sort request
     * @return paginated requires
     */
    @EntityGraph(attributePaths = {"user"})
    Page<Require> findByUser_Id(Long userId, Pageable pageable);

    /**
     * Returns a require only when it belongs to the given user.
     *
     * @param id require id
     * @param userId owner id
     * @return matching require if present
     */
    @EntityGraph(attributePaths = {"user"})
    Optional<Require> findByIdAndUserId(Long id, Long userId);

    /**
     * Updates the status of a require without loading the entity into memory.
     *
     * @param id require id
     * @param status new status value
     * @return number of updated rows
     */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update Require r set r.status = :status, r.updatedAt = CURRENT_TIMESTAMP where r.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") RequireStatus status);

    /**
     * Aggregates require counts by month and status for the requested date range.
     *
     * @param userId owner id
     * @param from inclusive range start
     * @param to exclusive range end
     * @return monthly status counts
     */
    @Query("""
    SELECT new com.sisyphus.backend.require.dto.StatusCountResponse(
        r.status,
        COUNT(r),
        MONTH(r.createdAt)
    )
    FROM Require r
    WHERE r.user.id = :userId
      AND r.createdAt >= :from
      AND r.createdAt < :to
    GROUP BY r.status, YEAR(r.createdAt), MONTH(r.createdAt)
    ORDER BY YEAR(r.createdAt), MONTH(r.createdAt)
""")
    List<StatusCountResponse> countAllStatusesInRange(
            @Param("userId") Long userId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}
