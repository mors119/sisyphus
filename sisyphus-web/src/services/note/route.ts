import api from '@/services/route';
import { NotePageResponse, NoteQueryParams, NoteRequest } from '@/types/note';

// 새로운 note 생성
export const createNote = (data: NoteRequest) => {
  return api.post('/note/create', data);
};

// note 수정
export const updateNote = ({ id, data }: { id: number; data: NoteRequest }) => {
  return api.put(`/note/update/${id}`, data);
};

// note 삭제
export const deleteNote = async (id: number) => {
  return await api.delete(`/note/delete/${id}`);
};

// note 상세보기
export const fetchNote = async (id: number) => {
  const res = await api.get(`/note/read/${id}`);
  return res.data;
};

// note 전체 보기
export const fetchNotes = async (
  params: NoteQueryParams,
): Promise<NotePageResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.set('page', String(params.page));
  queryParams.set('size', String(params.size));
  if (params.category && params.category !== 'ALL') {
    queryParams.set('category', params.category);
  }
  const { field, order } = params.sortOption;
  queryParams.append('sort', `${field},${order}`);

  const res = await api.get(`/note/read/all?${queryParams.toString()}`);
  return res.data;
};

// tag 별 노트 전체 보기
export const fetchTagNullNotes = async (
  params: NoteQueryParams,
): Promise<NotePageResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.set('page', String(params.page));
  queryParams.set('size', String(params.size));
  if (params.category && params.category !== 'ALL') {
    queryParams.set('category', params.category);
  }

  const res = await api.get(`/note/tagNull?${queryParams.toString()}`);
  return res.data;
};
