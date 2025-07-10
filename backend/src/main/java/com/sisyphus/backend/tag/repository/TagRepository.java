package com.sisyphus.backend.tag.repository;

import com.sisyphus.backend.tag.entity.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByNameAndOwnerId(String name, Long ownerId);

    List<Tag> findAllByOwnerId(Long userId);

    List<Tag> findByOwnerIdAndNameIn(Long ownerId, Collection<String> names);

    /** JPQL은 SQL이 아니라서 "엔티티의 필드 이름" 기준으로 작성해야 함. t.owner.id  */
    @Query("SELECT t FROM Tag t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND t.owner.id = :userId")
    Page<Tag> searchByKeyword(@Param("keyword") String keyword, @Param("userId") Long userId, Pageable pageable);

}
