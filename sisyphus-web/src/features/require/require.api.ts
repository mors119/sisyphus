import api from '@/services/route';
import { RequireForm, RequireStatusRequest } from './require.types';

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

export const deleteRequire = async (id: number) => {
  await api.delete(`/require/${id}`);
};

export const updateRequire = (data: RequireForm & { id: number }) => {
  return api.put(`/require/${data.id}`, data);
};

export const updateRequireStatus = (data: RequireStatusRequest) => {
  return api.put(`/require/status/${data.id}`, data);
};

export const countRequireStatus = async () => {
  const res = await api.get(`/require/status/count`);
  return res.data;
};
