package com.sisyphus.backend.category.controller;

import com.sisyphus.backend.category.dto.CategoryRequest;
import com.sisyphus.backend.category.dto.CategoryResponse;
import com.sisyphus.backend.category.service.CategoryService;
import com.sisyphus.backend.security.principal.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/all")
    public ResponseEntity<List<CategoryResponse>> getAllCategories(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(categoryService.getAllCategories(principal.getId()));
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createCategory(
            @RequestBody @Valid CategoryRequest categoryRequest,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        categoryService.createCategory(categoryRequest, principal.getId());
        return ResponseEntity.ok().build(); // status(201).build()
    }

//    TODO 1: CATEGORY delete 시에 노트를 어떻게 처리할 것인가
//    1. note의 CATEGORY 값은 비우기 또는 2.note도 삭제, 3. 하위 CATEGORY parentId 비우기 또는 4.. 하위 CATEGORY도 삭제

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        categoryService.deleteCategory(id, principal.getId());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updateCategory(
            @PathVariable Long id,
            @RequestBody @Valid CategoryRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        categoryService.updateCategory(id, request, principal.getId());
        return ResponseEntity.ok().build();
    }

}
