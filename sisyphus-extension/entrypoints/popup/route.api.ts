import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { BACK_URL } from './auth/auth.constants';
import { useAuthStore } from './auth/auth.store';

/** 내부 인터셉터에서 재시도 여부 플래그 */
interface CustomConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/** 공용 인스턴스 */
export const api = axios.create({
  baseURL: BACK_URL,
  withCredentials: true, // 쿠키 자동 포함
  headers: { 'Content-Type': 'application/json' },
});

/* ---------------- 요청 인터셉터 : accessToken 자동 첨부 ---------------- */
api.interceptors.request.use(async (config) => {
  const token =
    useAuthStore.getState().accessToken ||
    (await new Promise<string | null>((r) =>
      chrome.storage.local.get('accessToken', (res) =>
        r(res.accessToken ?? null),
      ),
    ));

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ---------------- 응답 인터셉터 : 401 → refresh 재시도 ---------------- */
let isRefreshing = false;
let queue: {
  resolve: (t: string) => void;
  reject: (e: AxiosError) => void;
}[] = [];

const processQueue = (err: AxiosError | null, token?: string) => {
  queue.forEach(({ resolve, reject }) => (err ? reject(err) : resolve(token!)));
  queue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const cfg = err.config as CustomConfig;
    if (!cfg) return Promise.reject(err);

    /* 로그인·리프레시 요청 자체면 패스 */
    const skip =
      cfg.url?.includes('/auth/login') ||
      cfg.url?.includes('/auth/signup') ||
      cfg.url?.includes('/auth/refresh');
    if (skip) return Promise.reject(err);

    /* 401 + 아직 재시도 안 했을 때만 */
    if (err.response?.status === 401 && !cfg._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) =>
          queue.push({ resolve, reject }),
        ).then((token) => {
          cfg.headers.Authorization = `Bearer ${token}`;
          return api(cfg);
        });
      }

      cfg._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<{ accessToken: string }>(
          `${BACK_URL}/auth/refresh`,
          null,
          { withCredentials: true },
        );
        const newToken = data.accessToken;

        useAuthStore.getState().setAccessToken(newToken);
        chrome.storage.local.set({ accessToken: newToken });

        processQueue(null, newToken);
        cfg.headers.Authorization = `Bearer ${newToken}`;
        return api(cfg);
      } catch (e) {
        processQueue(e as AxiosError);
        useAuthStore.getState().clear();
        localStorage.removeItem('auth-storage');
        window.location.href = '/'; // 필요시 PATHS.HOME
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  },
);
