import api from '@/services/route';
import { UserRequest } from '@/types/user';

// register
export const signupApi = (data: UserRequest) => api.post('/auth/signup', data);

// login
export const loginApi = (data: {
  email: string;
  password: string;
  provider: string;
}) => api.post('/auth/login', data);

// email check
export const checkApi = (data: { email: string }) =>
  api.post('/auth/check', data);

// logout
export const logoutApi = () => api.post('/auth/logout');

// 이메일 인증 코드 전송
export const sendVerificationCode = async (email: string) => {
  await api.post('/auth/send-email', { email });
};

// 인증 코드 검증
export const verifyEmailCode = async (
  email: string,
  code: string,
): Promise<boolean> => {
  const res = await api.post('/auth/verify-email', { email, code });
  return res.data;
};
