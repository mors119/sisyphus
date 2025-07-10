package com.sisyphus.backend.tag.dto;

import com.sisyphus.backend.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class TagSummary {
    private Long id;
    private String name;
    private User user;
}


