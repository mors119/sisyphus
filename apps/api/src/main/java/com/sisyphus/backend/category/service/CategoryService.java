package com.sisyphus.backend.category.service;

import com.sisyphus.backend.category.dto.CategoryRequest;
import com.sisyphus.backend.category.dto.CategoryResponse;
import com.sisyphus.backend.category.entity.Category;
import com.sisyphus.backend.category.exception.CategoryNotFoundException;
import com.sisyphus.backend.category.repository.CategoryRepository;
import com.sisyphus.backend.global.exception.ForbiddenException;
import com.sisyphus.backend.note.repository.NoteRepository;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.exception.UserNotFoundException;
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
    public List<CategoryResponse> getAllCategories(Long userId) {
        return categoryRepository.findAllByUserId(userId).stream()
                .map(CategoryResponse::fromEntity)
                .toList();
    }

    @Transactional
    public void createCategory(CategoryRequest categoryRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        Category category = new Category();
        category.setTitle(categoryRequest.getTitle());
        category.setColor(categoryRequest.getColor());
        category.setUser(user);

        categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id, Long userId) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(CategoryNotFoundException::new);
        validateOwner(category, userId);
        // 일치 하는 note 카테고리 null
        noteRepository.nullifyCategory(id);
        categoryRepository.delete(category);
    }

    @Transactional
    public void updateCategory(Long categoryId, CategoryRequest request, Long userId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(CategoryNotFoundException::new);
        validateOwner(category, userId);

        category.setTitle(request.getTitle());
        category.setColor(request.getColor());
    }

    private void validateOwner(Category category, Long userId) {
        if (!category.getUser().getId().equals(userId)) {
            throw new ForbiddenException("해당 카테고리에 접근할 권한이 없습니다.");
        }
    }
}