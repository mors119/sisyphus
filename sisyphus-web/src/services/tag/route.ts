import api from '../route';
import { TagForm } from '@/lib/validations/tag';

// Tag 전체 보기
export const fetchTags = async () => {
  const res = await api.get('/tag/all');
  return res.data;
};

export const createTag = async (data: TagForm) => {
  const res = await api.post('/tag/create', data);
  return res.data;
};

export const deleteTag = async (tagId: number) => {
  await api.delete(`/tag/delete/${tagId}`);
};

export const updateTag = (id: number, data: TagForm) => {
  return api.put(`/tag/update/${id}`, data);
};
