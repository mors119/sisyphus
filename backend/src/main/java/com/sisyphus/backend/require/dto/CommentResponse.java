package com.sisyphus.backend.require.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class CommentResponse {
    private Long id;
    private String content;
    private String userEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
