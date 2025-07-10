import api from '@/services/route';
import { TagRequest, TagResponse } from './tag.type';

export const fetchTags = async () => {
  const res = await api.get<TagResponse[]>('/tag');
  return res.data;
};

export const createTag = async (data: { name: string }[]) => {
  const res = await api.post('/tag', data);
  return res.data;
};

export const updateTag = async ({ data }: { data: TagRequest }) => {
  const res = await api.put('/tag/update', data);
  return res.data;
};

export const deleteTag = async (ids: number[]) => {
  const res = await api.delete('/tag', { data: ids });
  return res.data;
};
