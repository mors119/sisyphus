package com.sisyphus.backend.tag.repository;

import com.sisyphus.backend.tag.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    @Query("SELECT t FROM Tag t WHERE t.user.id = :userId")
    List<Tag> findAllByUserId(@Param("userId") Long userId);

    // @OneToMany(mappedBy = "parent")는 Lazy가 기본이라, 자식 태그까지 작업하려면 fetch join 꼭 써야함
    @Query("SELECT t FROM Tag t LEFT JOIN FETCH t.children WHERE t.id = :id")
    Optional<Tag> findWithChildrenById(@Param("id") Long id);
}
