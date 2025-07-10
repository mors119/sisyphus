import { TagResponse } from '../tag/tag.type';
import { NoteResponse } from './note.types';

export function normalizeNote(note: NoteResponse): NoteResponse {
  return {
    ...note,
    tags: (note.tags ?? []).map((t: TagResponse) => ({
      id: t.id ?? Date.now(), // 없으면 생성
      name: t.name ?? t,
    })),
  };
}
