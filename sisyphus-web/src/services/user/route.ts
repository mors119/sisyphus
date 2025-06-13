import api from '@/services/route';
import { UserResponse } from '@/types/user';

// 유저 정보
export const userReadApi = async (): Promise<UserResponse> => {
  const res = await api.post('/user/read', null);
  return res.data;
};

// 유저 상세정보
export const userDetailApi = async () => {
  const res = await api.post('/user/detail', null);

  return res.data;
};

export const userDeleteApi = async () => {
  const res = await api.delete('/user/delete');
  return res.data;
};

export const userUpdateApi = () => {};
