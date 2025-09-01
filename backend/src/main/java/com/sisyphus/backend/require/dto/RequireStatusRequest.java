package com.sisyphus.backend.require.dto;

import com.sisyphus.backend.require.util.RequireStatus;

public record RequireStatusRequest(@jakarta.validation.constraints.NotNull RequireStatus status) {}