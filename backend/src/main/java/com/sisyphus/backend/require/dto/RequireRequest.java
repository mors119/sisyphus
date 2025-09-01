package com.sisyphus.backend.require.dto;

import com.sisyphus.backend.require.util.RequireStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequireRequest {
    private String requireType;
    private String title;
    private String description;
    private RequireStatus status;
}
