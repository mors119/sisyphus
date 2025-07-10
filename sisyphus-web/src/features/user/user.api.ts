import api from '@/services/route';
import { UserResponse } from './user.types';

// 유저 정보
export const fetchUser = async (): Promise<UserResponse> => {
  const res = await api.post('/user/read', null);
  return res.data;
};

// 유저 상세정보
export const userDetailApi = async () => {
  const res = await api.post('/user/detail', null);
  return res.data;
};

// 유저 탈퇴
export const userDeleteApi = async () => {
  return await api.delete('/user/delete');
};

// 유저 업데이트
export const userUpdateApi = async (data: { name: string }) => {
  return api.put('/user/update', data);
};
