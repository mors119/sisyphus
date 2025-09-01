import api from '@/services/route';
import {
  NoteForm,
  NotePageResponse,
  NoteQueryParams,
} from '../quick_edit/note.types';

// 새로운 note 생성
export const createNote = (data: NoteForm) => {
  return api.post('/note/create', data);
};

// note 수정
export const updateNote = ({ id, data }: { id: number; data: NoteForm }) => {
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

  const { field, order } = params.sortOption;
  queryParams.append('sort', `${field},${order}`);
  if (params.categoryId)
    queryParams.set('categoryId', String(params.categoryId));
  if (params.tagId) queryParams.set('tagId', String(params.tagId));
  if (params.tit) queryParams.set('title', params.tit);

  const res = await api.get(`/note/read/all?${queryParams.toString()}`);
  return res.data;
};

// category 별 노트 전체 보기
export const fetchCategoryNullNotes = async (
  params: NoteQueryParams,
): Promise<NotePageResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.set('page', String(params.page));
  queryParams.set('size', String(params.size));

  const res = await api.get(`/note/categoryNull?${queryParams.toString()}`);
  return res.data;
};
