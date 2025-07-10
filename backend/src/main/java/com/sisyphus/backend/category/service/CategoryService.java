package com.sisyphus.backend.category.service;

import com.sisyphus.backend.category.dto.CategoryRequest;
import com.sisyphus.backend.category.entity.Category;
import com.sisyphus.backend.category.repository.CategoryRepository;
import com.sisyphus.backend.note.repository.NoteRepository;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final NoteRepository noteRepository;

    @Transactional(readOnly = true)
    public List<Category> getAllCategories(Long userId) {
        return categoryRepository.findAllByUserId(userId);
    }

    public void createCategory(CategoryRequest categoryRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Category category = new Category();
        category.setTitle(categoryRequest.getTitle());
        category.setColor(categoryRequest.getColor());
        category.setUser(user);

        categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("태그를 찾을 수 없습니다."));
        // 일치 하는 note 카테고리 null
        noteRepository.nullifyCategory(id);
        categoryRepository.delete(category);
    }

    @Transactional
    public void updateCategory(Long categoryId, CategoryRequest request, Long userId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("태그를 찾을 수 없습니다."));

        // 사용자 검증 (보안용)
        if (!category.getUser().getId().equals(userId)) {
            throw new SecurityException("해당 태그를 수정할 권한이 없습니다.");
        }

        category.setTitle(request.getTitle());
        category.setColor(request.getColor());
    }

}