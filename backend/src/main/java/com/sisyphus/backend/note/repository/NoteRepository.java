package com.sisyphus.backend.note.repository;


import com.sisyphus.backend.note.entity.Note;
import com.sisyphus.backend.note.util.NoteCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    boolean existsById(Long id);

    @EntityGraph(attributePaths = {"tag"}) // LEFT JOIN FETCH 사용 시 page<>를 사용할 수 없음
    @Query("""
  SELECT n FROM Note n
  WHERE n.user.id = :userId
  AND (:category IS NULL OR n.category = :category)
""")
    Page<Note> findAllWithTagByUserIdAndCategory(
            @Param("userId") Long userId,
            @Param("category") NoteCategory category,
            Pageable pageable
    );

    Optional<Note> findByIdAndUserId(Long wordId, Long userId);

// tag값과 함꼐 상세보기
//    @Query("SELECT n FROM Note n JOIN FETCH n.tag WHERE n.id = :id")
    @Query("SELECT n FROM Note n LEFT JOIN FETCH n.tag WHERE n.id = :id")
    Optional<Note> findNoteWithTagById(@Param("id") Long id);

//     tag가 null인 note만 return
    @Query("SELECT n FROM Note n WHERE n.tag IS NULL AND n.user.id = :userId"
            + " AND (:category IS NULL OR n.category = :category)")
    Page<Note> findNotesWithNullTagByUserAndOptionalCategory(
            @Param("userId") Long userId,
            @Param("category") NoteCategory category,
            Pageable pageable
    );
}
