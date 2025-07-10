import { NoteResponse } from '@/features/quick_edit/note.types';
import { NoteForm } from '@/features/view/view.types';

export const normalizeNoteToForm = (note: NoteResponse): NoteForm => {
  return {
    title: note.title,
    subTitle: note.subTitle ?? '',
    description: note.description ?? '',
    tags: note.tags ?? [],
    categoryId: note.category?.id ?? undefined,
  };
};
