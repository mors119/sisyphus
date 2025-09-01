package com.sisyphus.backend.note.repository;

import com.sisyphus.backend.note.entity.Note;
import com.sisyphus.backend.user.entity.User;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    boolean existsById(@NonNull Long id);

    // ⚠️ Page 반환: 컬렉션 fetch 금지 → category(TO-ONE)만 fetch
    @EntityGraph(attributePaths = { "category" }, type = EntityGraph.EntityGraphType.FETCH)
    @Query("""
    SELECT DISTINCT n FROM Note n
    LEFT JOIN n.noteTags nt
    LEFT JOIN nt.tag t
    WHERE n.user.id = :userId
      AND (:categoryId IS NULL OR n.category.id = :categoryId)
      AND (:tagId IS NULL OR t.id = :tagId)
      AND (:titlePattern IS NULL OR LOWER(n.title) LIKE :titlePattern)
    ORDER BY n.createdAt DESC
    """)
    Page<Note> findAllFiltered(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId,
            @Param("tagId") Long tagId,
            @Param("titlePattern") String titlePattern,
            Pageable pageable
    );

    Optional<Note> findByIdAndUserId(Long wordId, Long userId);

    /**
     * 단건 상세보기: 컬렉션 fetch join 허용(페이징 아님 → 안전)
     */
    @EntityGraph(attributePaths = {"category"}, type = EntityGraph.EntityGraphType.FETCH)
    @Query("""
        SELECT DISTINCT n
        FROM Note n
        LEFT JOIN FETCH n.noteTags nt
        LEFT JOIN FETCH nt.tag
        LEFT JOIN FETCH n.images img
        WHERE n.id = :id AND n.user = :user
            AND (img IS NULL OR img.deletedAt IS NULL)
        """)
    Optional<Note> findNoteByUserId(@Param("id") Long id, @Param("user") User user);

    /**
     * Page 반환: 컬렉션 fetch 금지 (경고 방지)
     */
    @EntityGraph(attributePaths = { "category" }, type = EntityGraph.EntityGraphType.FETCH)
    @Query("""
        SELECT n
        FROM Note n
        WHERE n.category IS NULL
          AND n.user.id = :userId
        ORDER BY n.createdAt DESC
        """)
    Page<Note> findNotesWithNullCategoryByUser(
            @Param("userId") Long userId,
            Pageable pageable
    );

    @Modifying
    @Query("update Note n set n.category = null where n.category.id = :categoryId")
    void nullifyCategory(Long categoryId);

    // 이건 컬렉션 fetch 없음 → 그대로 OK
    @Query("""
        SELECT n
        FROM Note n
        WHERE LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
          AND n.user.id = :userId
        ORDER BY n.createdAt DESC
        """)
    Page<Note> searchByKeyword(@Param("keyword") String keyword,
                               @Param("userId") Long userId,
                               Pageable pageable);

    // 상세 로딩용: 페이징 없이 한 번에 컬렉션 fetch
    @EntityGraph(attributePaths = { "category" }, type = EntityGraph.EntityGraphType.FETCH)
    @Query("""
        SELECT DISTINCT n
        FROM Note n
        LEFT JOIN FETCH n.images img
        LEFT JOIN FETCH n.noteTags nt
        LEFT JOIN FETCH nt.tag
        WHERE n.id IN :ids
                AND (img IS NULL OR img.deletedAt IS NULL)
        """)
    List<Note> findDetailsByIdIn(@Param("ids") List<Long> ids);
}
