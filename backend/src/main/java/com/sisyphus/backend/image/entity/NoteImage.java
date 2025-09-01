package com.sisyphus.backend.image.entity;

import com.sisyphus.backend.note.entity.Note;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Entity
@NoArgsConstructor
@DiscriminatorValue("NOTE")
public class NoteImage extends Image {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id")
    private Note note;

    public NoteImage(String url, String originName, String extension, Long size) {
        super(url, originName, extension, size);
    }

}