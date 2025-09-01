import { NoteForm, NoteResponse } from '@/features/quick_edit/note.types';
import { EMPTY_FORM } from '@/features/view/view.constants';

export const normalizeNoteToForm = (note?: NoteResponse | null): NoteForm => {
  if (!note) return EMPTY_FORM;

  return {
    title: note.title,
    subTitle: note.subTitle ?? '',
    description: note.description ?? '',
    tags: note.tags ?? [],
    categoryId: note.category?.id ?? undefined,
    imageId: note.image?.[0]?.id ?? undefined,
  };
};
