package com.sisyphus.backend.unit;

import com.sisyphus.backend.category.entity.Category;
import com.sisyphus.backend.note.entity.Note;
import com.sisyphus.backend.tag.entity.Tag;
import com.sisyphus.backend.user.entity.User;
import com.sisyphus.backend.user.util.Role;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalArgumentException;

class DomainModelTest {

    private final User owner = new User("owner@example.com", "Owner", Role.USER);

    @Test
    void categoryFactoryNormalizesTitlesAndSkipsEmptyValues() {
        List<Category> categories = Category.of(owner, "  Work  ", "", null, "Study");

        assertThat(categories)
                .extracting(Category::getTitle)
                .containsExactly("Work", "Study");
    }

    @Test
    void categoryRequiresAnOwnerAndTitle() {
        assertThatIllegalArgumentException().isThrownBy(() -> Category.of(null, "Work"));
        assertThatIllegalArgumentException().isThrownBy(() -> Category.of(owner, " "));
    }

    @Test
    void tagNormalizesNamesAndRejectsEmptyUpdates() {
        Tag tag = Tag.of("  Spring Boot  ", owner);

        assertThat(tag.getName()).isEqualTo("spring boot");
        assertThatIllegalArgumentException().isThrownBy(() -> tag.changeName(" "));
    }

    @Test
    void noteDoesNotCreateDuplicateTagLinks() {
        Note note = Note.of("Title", null, null, null, owner);
        Tag tag = Tag.of("java", owner);

        note.addTag(tag);
        note.addTag(tag);

        assertThat(note.getNoteTags()).hasSize(1);
        assertThat(tag.getNoteTags()).hasSize(1);
    }

    @Test
    void notePreservesOptionalFieldsAndSupportsClearingThem() {
        Note note = Note.of("Title", "Subtitle", "Description", null, owner);

        note.updateNote("Updated", null, null, null);

        assertThat(note.getTitle()).isEqualTo("Updated");
        assertThat(note.getSubTitle()).isNull();
        assertThat(note.getDescription()).isNull();
        assertThat(note.getCategory()).isNull();
    }
}
