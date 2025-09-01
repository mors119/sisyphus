import api from '@/services/route';
import { UserAndAccount } from './dashboard.type';

export const fetchUserCount = async () => {
  const res = await api.get<UserAndAccount>('/user/count');
  return res.data;
};

export const fetchRequireAll = async (page: number, size: number) => {
  const res = await api.get(`/require/dashboard?page=${page}&size=${size}`);
  return res.data;
};
