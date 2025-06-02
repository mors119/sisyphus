package com.sisyphus.backend.note.repository;


import com.sisyphus.backend.note.entity.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WordRepository extends JpaRepository<Word, Long> {
    List<Word> findAllByUserId(Long userId);
    Optional<Word> findByIdAndUserId(Long wordId, Long userId);
}
