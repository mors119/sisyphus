package com.sisyphus.backend.note.tag.dto;

import java.io.Serializable;
import java.util.Objects;

public class NoteTagId implements Serializable {
    private Long note;
    private Long tag;

    public NoteTagId() {}

    public NoteTagId(Long note, Long tag) {
        this.note = note;
        this.tag = tag;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof NoteTagId that)) return false;
        return Objects.equals(note, that.note) &&
                Objects.equals(tag, that.tag);
    }

    @Override
    public int hashCode() {
        return Objects.hash(note, tag);
    }
}
