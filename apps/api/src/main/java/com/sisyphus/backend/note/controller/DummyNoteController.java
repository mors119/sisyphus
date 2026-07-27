package com.sisyphus.backend.note.controller;

import com.sisyphus.backend.note.dummy.DummyNoteSeedService;
import com.sisyphus.backend.security.principal.UserPrincipal;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile({"local", "dev"})
@Hidden
@RestController
@RequestMapping("/api/dev/note")
@RequiredArgsConstructor
public class DummyNoteController {

    private final DummyNoteSeedService dummyNoteSeedService;

    @PostMapping("/seed")
    public ResponseEntity<String> seed(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        int created = dummyNoteSeedService.seedForAuthenticatedUser(principal);

        return ResponseEntity
                .status(201)
                .body("created=" + created);
    }
}
