import { api } from '../route.api';
import type { AuthRequest } from './auth.schema';

export const loginApi = async (req: AuthRequest) => {
  const res = await api.post('/auth/extension/login', req);
  return res.data;
};

export const exchangeExtensionCodeApi = async (request: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}) => {
  const res = await api.post<{ accessToken: string }>(
    '/auth/extension/token',
    request,
  );
  return res.data;
};
