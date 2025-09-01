package com.sisyphus.backend.image.dto;

import com.sisyphus.backend.image.entity.NoteImage;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ImageResponse {

    private Long id;
    private String originName;
    private String url;

    public static ImageResponse fromEntity(NoteImage noteImage) {
        return new ImageResponse(noteImage.getId(), noteImage.getOriginName(), noteImage.getUrl());
    }
}
