package com.sisyphus.backend.note.tag.entity;

import com.sisyphus.backend.note.entity.Note;
import com.sisyphus.backend.note.tag.dto.NoteTagId;
import com.sisyphus.backend.tag.entity.Tag;
import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "note_tag")
@IdClass(NoteTagId.class)     // 복합 PK: (note_id, tag_id)
public class NoteTag {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id")
    private Note note;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id")
    private Tag tag;

    protected NoteTag() {}           // JPA 기본 생성자
    public NoteTag(Note note, Tag tag) { this.note = note; this.tag = tag; }

    public Note getNote() { return note; }
    public Tag getTag()  { return tag;  }

    /* --- equals / hashCode: 불변 ID 값만 사용해 HashSet 충돌 방지 --- */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof NoteTag that)) return false;
        return Objects.equals(note.getId(), that.note.getId()) &&
                Objects.equals(tag.getId(),  that.tag.getId());
    }
    @Override
    public int hashCode() {
        return Objects.hash(note.getId(), tag.getId());
    }

    /* --- 양방향 관계 끊기 --- */
    public void unlink() {
        if (note != null) {
            note.getNoteTags().remove(this);
        }
        if (tag != null) {
            tag.getNoteTags().remove(this);
        }
        note = null;
        tag  = null;
    }
}
