import { NoteForm } from '@/lib/validations/note';
import { NoteResponse } from '@/types/note';

export const normalizeNoteToForm = (note: NoteResponse): NoteForm => {
  return {
    title: note.title,
    subTitle: note.subTitle ?? '',
    description: note.description ?? '',
    tagId: note.tag?.id ?? undefined,
    category: note.category === 'ALL' ? 'NOTE' : note.category, // ALL은 UI에서 허용하지 않도록
  };
};
