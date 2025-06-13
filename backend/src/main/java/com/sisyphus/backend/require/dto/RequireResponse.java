package com.sisyphus.backend.require.dto;

import com.sisyphus.backend.require.util.RequireStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequireResponse {
    private Long id;
    private String title;
    private String userEmail;
    private String description;
    private RequireStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommentResponse> comments;
}
