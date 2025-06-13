package com.sisyphus.backend.__name__.controller;

import com.sisyphus.backend.__name__.dto.__Name__Request;
import com.sisyphus.backend.__name__.dto.__Name__Response;
import com.sisyphus.backend.__name__.service.__Name__Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST 컨트롤러
@RestController
@RequestMapping("/api/__name__")
@RequiredArgsConstructor
public class __Name__Controller {

    private final __Name__Service __name__Service;

    // 모든 데이터 조회
    @GetMapping
    public ResponseEntity<List<__Name__Response>> getAll() {
        return ResponseEntity.ok(__name__Service.getAll());
    }

    // 데이터 생성
    @PostMapping
    public ResponseEntity<__Name__Response> create(@RequestBody __Name__Request request) {
        return ResponseEntity.ok(__name__Service.create(request));
    }

    // 단일 데이터 조회
    @GetMapping("/{id}")
    public ResponseEntity<__Name__Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(__name__Service.getById(id));
    }

    // 데이터 수정
    @PutMapping("/{id}")
    public ResponseEntity<__Name__Response> update(@PathVariable Long id) {
        return ResponseEntity.ok(__name__Service.update(id));
    }

    // 데이터 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        __name__Service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
