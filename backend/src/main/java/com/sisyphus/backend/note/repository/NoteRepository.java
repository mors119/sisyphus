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

import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {


    boolean existsById(@NonNull Long id);


    @EntityGraph(attributePaths = {"category", "noteTags", "noteTags.tag"})
    @Query("""
            SELECT DISTINCT n FROM Note n
            LEFT JOIN n.noteTags nt
            LEFT JOIN nt.tag t
            WHERE n.user.id = :userId
            AND (:categoryId IS NULL OR n.category.id = :categoryId)
            AND (:tagId IS NULL OR t.id = :tagId)
            AND (:title IS NULL OR LOWER(n.title) LIKE LOWER(CONCAT('%', :title, '%')))
            """)
    Page<Note> findAllFiltered(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId,
            @Param("tagId") Long tagId,
            @Param("title") String titleParam,
            Pageable pageable
    );

    Optional<Note> findByIdAndUserId(Long wordId, Long userId);

    /**
     * category와 함께 상세보기
     */
    @EntityGraph(attributePaths = {"category"}, type = EntityGraph.EntityGraphType.FETCH)
    @Query("""
            SELECT n
            FROM Note n
            LEFT JOIN FETCH n.noteTags nt
            LEFT JOIN FETCH nt.tag
            WHERE n.id = :id AND n.user = :user
            """)
    Optional<Note> findNoteByUserId(@Param("id") Long id, @Param("user") User user);

    /**
     * category가 null인 note만 return
     */
    @Query("""
            SELECT n
            FROM Note n
            LEFT JOIN FETCH n.noteTags nt
            LEFT JOIN FETCH nt.tag
            WHERE n.category IS NULL
              AND n.user.id = :userId
            """)
    Page<Note> findNotesWithNullCategoryByUser(
            @Param("userId") Long userId,
            Pageable pageable
    );

    @Modifying
    @Query("update Note n set n.category = null where n.category.id = :categoryId")
    void nullifyCategory(Long categoryId);

    @Query("SELECT n FROM Note n WHERE LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) AND n.user.id = :userId")
    Page<Note> searchByKeyword(@Param("keyword") String keyword, @Param("userId") Long userId, Pageable pageable);

}
