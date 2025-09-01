package com.sisyphus.backend.require.dto;

import com.sisyphus.backend.require.util.RequireStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StatusCountResponse {
    private RequireStatus status;
    private Long count;
    private Integer month;

    public StatusCountResponse(RequireStatus status, Long count, Integer month) {
        this.status = status;
        this.count = count;
        this.month = month;
    }
}
