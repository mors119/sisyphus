package com.sisyphus.backend.__name__.service;

import com.sisyphus.backend.__name__.dto.__Name__Request;
import com.sisyphus.backend.__name__.dto.__Name__Response;
import com.sisyphus.backend.__name__.entity.__Name__;
import com.sisyphus.backend.__name__.repository.__Name__Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// 서비스 로직 처리
@Service
@RequiredArgsConstructor
public class __Name__Service {

    private final __Name__Repository __name__Repository;

    public List<__Name__Response> getAll() {
        return __name__Repository.findAll().stream()
                .map(__Name__Response::fromEntity)
                .collect(Collectors.toList());
    }

    public __Name__Response create(__Name__Request request) {
        __Name__ entity = __name__Repository.save(__Name__.fromRequest(request));
        return __Name__Response.fromEntity(entity);
    }

    public __Name__Response getById(Long id) {
        return __name__Repository.findById(id)
                .map(__Name__Response::fromEntity)
                .orElseThrow(() -> new RuntimeException("__Name__ not found"));
    }

    public void delete(Long id) {
        __name__Repository.deleteById(id);
    }
}
