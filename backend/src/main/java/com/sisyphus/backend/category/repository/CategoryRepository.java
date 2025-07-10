package com.sisyphus.backend.category.repository;

import com.sisyphus.backend.category.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT c FROM Category c WHERE c.user.id = :userId")
    List<Category> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Category c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) AND c.user.id = :userId")
    Page<Category> searchByKeyword(@Param("keyword") String keyword, @Param("userId") Long userId, Pageable pageable);

}
