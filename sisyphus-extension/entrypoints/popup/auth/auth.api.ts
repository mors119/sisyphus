import { api } from '../route.api';
import { AuthRequest } from './auth.schema';

export const loginApi = async (req: AuthRequest) => {
  const res = await api.post('/auth/login', req);
  return res.data;
};

export const logoutApi = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};
