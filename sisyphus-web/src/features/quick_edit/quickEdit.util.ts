import { NoteForm, NoteResponse } from './note.types';

export const responseToForm = (data: NoteResponse): NoteForm => ({
  title: data.title,
  subTitle: data.subTitle ?? '',
  description: data.description ?? '',
  tags: (data.tags ?? []).map((t) => ({ id: t.id, name: t.name })), // TagResponse → {id,name}
  categoryId: data.category?.id ?? undefined, // 없으면 undefined
});
