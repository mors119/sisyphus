package com.sisyphus.backend.global.config;

import com.sisyphus.backend.global.error.ErrorResponse;
import io.swagger.v3.core.converter.ModelConverters;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class OpenApiCommonResponsesConfig {

    private static final String ERROR_SCHEMA_REF = "#/components/schemas/ErrorResponse";

    @Bean
    public OpenApiCustomizer globalErrorResponsesCustomizer() {
        return openApi -> {
            registerErrorContract(openApi);
            registerReusableResponses(openApi.getComponents());

            openApi.getPaths().values().forEach(pathItem ->
                    pathItem.readOperations().forEach(operation -> {
                        ApiResponses responses = operation.getResponses();
                        if (responses == null) {
                            responses = new ApiResponses();
                            operation.setResponses(responses);
                        }
                        addErrorResponseIfAbsent(responses, "500", "InternalServerError");
                        if (operation.getSecurity() != null && !operation.getSecurity().isEmpty()) {
                            addErrorResponseIfAbsent(responses, "401", "UnauthorizedError");
                        }
                        attachErrorSchemas(responses);
                    })
            );
        };
    }

    private void registerErrorContract(OpenAPI openApi) {
        Components components = openApi.getComponents() == null
                ? new Components()
                : openApi.getComponents();
        openApi.setComponents(components);

        ModelConverters.getInstance()
                .read(ErrorResponse.class)
                .forEach(components::addSchemas);
    }

    private void registerReusableResponses(Components components) {
        components
                .addResponses("ValidationError", reusableError("Request validation failed", "VALIDATION_ERROR", 400))
                .addResponses("UnauthorizedError", reusableError("Authentication is required", "UNAUTHORIZED", 401))
                .addResponses("ForbiddenError", reusableError("Access is forbidden", "FORBIDDEN", 403))
                .addResponses("NotFoundError", reusableError("The requested resource was not found", "NOT_FOUND", 404))
                .addResponses("ConflictError", reusableError("The request conflicts with current state", "CONFLICT", 409))
                .addResponses("InternalServerError", reusableError("An unexpected server error occurred", "INTERNAL_SERVER_ERROR", 500));
    }

    private ApiResponse reusableError(String description, String code, int status) {
        Map<String, Object> example = Map.of(
                "status", status,
                "code", code,
                "message", description,
                "path", "/api/example",
                "timestamp", "2026-07-26T00:00:00Z",
                "fieldErrors", status == 400
                        ? java.util.List.of(Map.of("field", "email", "message", "올바른 이메일 형식이어야 합니다."))
                        : java.util.List.of()
        );
        Content content = errorContent();
        content.get("application/json").example(example);

        return new ApiResponse()
                .description(description)
                .content(content);
    }

    private void addErrorResponseIfAbsent(ApiResponses responses, String status, String componentName) {
        if (!responses.containsKey(status)) {
            responses.addApiResponse(
                    status,
                    new ApiResponse().$ref("#/components/responses/" + componentName)
            );
        }
    }

    private void attachErrorSchemas(ApiResponses responses) {
        responses.forEach((status, response) -> {
            if (!isErrorStatus(status) || response.get$ref() != null || response.getContent() != null) {
                return;
            }
            response.setContent(errorContent());
        });
    }

    private boolean isErrorStatus(String status) {
        return switch (status) {
            case "400", "401", "403", "404", "409", "500" -> true;
            default -> false;
        };
    }

    private Content errorContent() {
        return new Content().addMediaType(
                org.springframework.http.MediaType.APPLICATION_JSON_VALUE,
                new MediaType().schema(new Schema<>().$ref(ERROR_SCHEMA_REF))
        );
    }
}
