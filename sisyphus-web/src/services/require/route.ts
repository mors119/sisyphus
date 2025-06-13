import { RequireForm } from '@/lib/validations/require';
import api from '../route';

// Require
export const fetchRequires = async () => {
  const res = await api.get('/require/all');
  return res.data;
};

export const fetchMyRequires = async (page: number = 0, size: number = 10) => {
  const res = await api.get('/require/readAll', {
    params: { page, size },
  });
  return res.data; // Spring pageable 응답 그대로
};

export const fetchRequire = async (id: number) => {
  const res = await api.get(`/require/${id}`);
  return res.data;
};

export const createRequire = async (data: RequireForm) => {
  const res = await api.post('/require/create', data);
  return res.data;
};

export const deleteRequire = async (tagId: number) => {
  await api.delete(`/require/${tagId}`);
};

export const updateRequire = (data: RequireForm) => {
  return api.put(`/require/${data.id}`, data);
};
