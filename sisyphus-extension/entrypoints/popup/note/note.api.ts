import { api } from '../route.api';
import { NoteRequest } from './note.schema';

export const createNote = async (req: NoteRequest) => {
  const res = await api.post('/note/create', req);
  return res.data;
};
