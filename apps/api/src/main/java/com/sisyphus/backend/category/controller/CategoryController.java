package com.sisyphus.backend.category.controller;

import com.sisyphus.backend.category.dto.CategoryRequest;
import com.sisyphus.backend.category.dto.CategoryResponse;
import com.sisyphus.backend.category.service.CategoryService;
import com.sisyphus.backend.security.principal.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
@Tag(name = "Category", description = "Category CRUD for the authenticated user")
@SecurityRequirement(name = "bearerAuth")
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "List categories", description = "Returns every category owned by the authenticated user.")
    @ApiResponse(responseCode = "200", description = "Categories returned")
    @GetMapping("/all")
    public ResponseEntity<List<CategoryResponse>> getAllCategories(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(categoryService.getAllCategories(principal.getId()));
    }

    @Operation(summary = "Create category", description = "Creates a category for the authenticated user.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Category created"),
            @ApiResponse(responseCode = "400", description = "Request validation failed")
    })
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

    @Operation(
            summary = "Delete category",
            description = "Deletes an owned category and clears that category from associated notes."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Category deleted"),
            @ApiResponse(responseCode = "403", description = "Category belongs to another user"),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCategory(
            @Parameter(description = "Category identifier", example = "3")
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        categoryService.deleteCategory(id, principal.getId());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Update category", description = "Updates the title and color of an owned category.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Category updated"),
            @ApiResponse(responseCode = "400", description = "Request validation failed"),
            @ApiResponse(responseCode = "403", description = "Category belongs to another user"),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updateCategory(
            @Parameter(description = "Category identifier", example = "3")
            @PathVariable Long id,
            @RequestBody @Valid CategoryRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        categoryService.updateCategory(id, request, principal.getId());
        return ResponseEntity.ok().build();
    }

}
