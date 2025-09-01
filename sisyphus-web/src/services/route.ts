import { PATHS } from '@/app/router/paths.constants';
import { useAuthStore } from '@/features/auth/auth.store';
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// axios 기본 설정
// 토큰 만료시 토큰 재발급
const api = axios.create({
  baseURL: '/api', // 모든 요청의 기본 URL 경로
  withCredentials: true, // 쿠키를 요청에 자동으로 포함시킴 (Refresh Token이 쿠키에 저장돼 있을 때 필요)
});

/**
 * @description InternalAxiosRequestConfig 타입을 확장하여 커스텀 프로퍼티를 추가합니다.
 * `_retry`는 재시도 여부를 판단하기 위한 플래그입니다.
 */
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 요청 시 accessToken 자동 삽입
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 헤더에 Bearer 토큰 삽입
    }
    return config;
  },
);

// --- 동시 요청 처리를 위한 변수 및 로직 ---

// 현재 토큰 리프레시가 진행 중인지 여부를 나타내는 플래그
let isRefreshing = false;
// 토큰 리프레시 중 실패한 요청들을 저장하는 큐
let failedQueue: {
  resolve: (value: string) => void;
  reject: (error: AxiosError) => void;
}[] = [];

/**
 * @description 대기열에 쌓인 모든 요청을 처리하는 함수
 * @param error - 리프레시 과정에서 발생한 에러. 성공 시 null
 * @param token - 새로 발급받은 액세스 토큰. 실패 시 null
 */
const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      // 리프레시가 실패했다면, 대기중인 모든 요청을 실패 처리
      prom.reject(error);
    } else if (token) {
      // 리프레시가 성공했다면, 새로운 토큰으로 모든 요청을 성공 처리 (재시도되도록)
      prom.resolve(token);
    }
  });
  // 처리 후 큐 비우기
  failedQueue = [];
};

// --- 응답 인터셉터 ---

// 응답 에러 시 401 → refresh 토큰으로 재시도
api.interceptors.response.use(
  (res) => res, // 성공적인 응답은 그대로 반환
  async (err: AxiosError) => {
    // AxiosError가 아니거나, config 객체가 없는 경우는 그대로 에러를 반환
    if (!err.config) {
      return Promise.reject(err);
    }
    const originalRequest = err.config as CustomInternalAxiosRequestConfig;

    // 로그인·회원가입·리프레시 자체 등 ‘토큰 없어도 401이 정상’인 엔드포인트는 바로 reject 해서 onError 로 흘려보낸다
    const skipRefresh =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/signup') ||
      originalRequest.url?.includes('/auth/refresh');

    if (skipRefresh) {
      return Promise.reject(err);
    }

    // 401 에러이고, 재시도된 요청이 아닐 때만 리프레시 로직 실행
    if (err.response?.status === 401 && !originalRequest._retry) {
      // 이미 다른 요청에 의해 토큰 리프레시가 진행 중이라면
      if (isRefreshing) {
        // 현재 요청을 대기열에 추가하고, 새로운 Promise를 반환
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // 리프레시가 성공하면 새로운 토큰으로 현재 요청의 헤더를 교체
            originalRequest.headers.Authorization = 'Bearer ' + token;
            // 수정된 설정으로 재요청
            return api(originalRequest);
          })
          .catch((promiseErr) => {
            return Promise.reject(promiseErr);
          });
      }

      // 리프레시 로직 시작
      originalRequest._retry = true; // 무한 루프 방지용 플래그 설정
      isRefreshing = true; // 리프레시 진행 중 상태로 변경

      try {
        // 리프레시 엔드포인트로 새로운 액세스 토큰 요청
        const refreshRes = await axios.post<{ accessToken: string }>(
          '/api/auth/refresh',
          null,
          {
            withCredentials: true, // 쿠키 포함해서 보냄
          },
        );

        const newAccessToken = refreshRes.data.accessToken;

        // 1. Zustand 스토어의 상태 업데이트
        useAuthStore.getState().setAccessToken(newAccessToken);

        // 2. 대기열에 있던 모든 요청들을 새로운 토큰으로 재실행
        processQueue(null, newAccessToken);

        // 3. 실패했던 원래 요청의 헤더에 새로운 토큰 설정
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 4. 실패했던 원래 요청을 다시 실행
        return api(originalRequest);
      } catch (refreshErr) {
        // 5. 리프레시 실패 시, 대기열의 모든 요청을 실패 처리
        processQueue(refreshErr as AxiosError, null);

        // 리프레시 실패 시: 스토어 초기화 및 로그인 페이지로 리디렉션
        useAuthStore.getState().clear(); // 상태 초기화
        localStorage.removeItem('auth-storage'); // Zustand persist 사용 시 로컬 스토리지도 정리
        window.location.href = PATHS.HOME; // 로그인 페이지로 강제 이동

        return Promise.reject(refreshErr); // 에러 반환
      } finally {
        // 6. 성공/실패 여부와 관계없이 리프레시 상태를 초기화
        isRefreshing = false;
      }
    }

    // 401 에러가 아니거나, 재시도 플래그가 있는 경우 등 나머지 경우는 모두 그대로 에러를 반환
    return Promise.reject(err);
  },
);

export default api;
