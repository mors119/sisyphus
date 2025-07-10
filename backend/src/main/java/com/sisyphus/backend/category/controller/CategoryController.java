package com.sisyphus.backend.category.controller;

import com.sisyphus.backend.auth.jwt.JwtTokenProvider;
import com.sisyphus.backend.category.dto.CategoryRequest;
import com.sisyphus.backend.category.dto.CategoryResponse;
import com.sisyphus.backend.category.entity.Category;
import com.sisyphus.backend.category.service.CategoryService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final JwtTokenProvider jwtTokenProvider;
    private final CategoryService categoryService;

    @GetMapping("/all")
    public ResponseEntity<List<CategoryResponse>> getAllCategories(HttpServletRequest request) {
        Long userId = jwtTokenProvider.getUserId(jwtTokenProvider.resolveToken(request));
        List<Category> categories = categoryService.getAllCategories(userId);
        List<CategoryResponse> response = categories.stream().map(CategoryResponse::fromEntity).toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createCategory(@RequestBody CategoryRequest categoryRequest, HttpServletRequest request) {
        Long userId = jwtTokenProvider.getUserId(jwtTokenProvider.resolveToken(request));
        categoryService.createCategory(categoryRequest, userId);
        return ResponseEntity.ok().build(); // status(201).build()
    }

//    TODO 1: CATEGORY delete 시에 노트를 어떻게 처리할 것인가
//    1. note의 CATEGORY 값은 비우기 또는 2.note도 삭제, 3. 하위 CATEGORY parentId 비우기 또는 4.. 하위 CATEGORY도 삭제

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequest request,
            HttpServletRequest httpRequest
    ) {
        Long userId = jwtTokenProvider.getUserId(jwtTokenProvider.resolveToken(httpRequest));
        categoryService.updateCategory(id, request, userId);
        return ResponseEntity.ok().build();
    }

}
