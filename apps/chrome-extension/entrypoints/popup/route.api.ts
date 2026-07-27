import axios, { AxiosError } from 'axios';
import { BACK_URL } from './auth/auth.constants';
import { useAuthStore } from './auth/auth.store';

/** 공용 인스턴스 */
export const api = axios.create({
  baseURL: BACK_URL,
  headers: { 'Content-Type': 'application/json' },
});

/* ---------------- 요청 인터셉터 : accessToken 자동 첨부 ---------------- */
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    // AxiosHeaders 호환을 위해 set 사용
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().clear();
    }

    return Promise.reject(err);
  },
);
