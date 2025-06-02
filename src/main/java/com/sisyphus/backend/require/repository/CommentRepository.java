package com.sisyphus.backend.require.repository;

import com.sisyphus.backend.require.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByRequireId(Long requireId);
}
