package com.sisyphus.backend.note.controller;

import com.sisyphus.backend.note.dummy.DummyNoteSeedService;
import com.sisyphus.backend.global.exception.UnauthorizedException;
import com.sisyphus.backend.security.principal.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile({"local", "dev"})
@RestController
@RequestMapping("/api/dev/note")
@RequiredArgsConstructor
public class DummyNoteController {

    private final DummyNoteSeedService dummyNoteSeedService;

    @PostMapping("/seed")
    public ResponseEntity<String> seed(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (principal == null) {
            throw new UnauthorizedException("더미 데이터 시딩은 로그인 후에만 가능합니다.");
        }

        int created = dummyNoteSeedService.seed(principal.getId());

        return ResponseEntity
                .status(201)
                .body("created=" + created);
    }
}
