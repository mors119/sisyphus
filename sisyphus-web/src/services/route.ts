import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';

// axios 기본 설정
// 토큰 만료시 토큰 재발급
const api = axios.create({
  baseURL: '/api', // 모든 요청의 기본 URL 경로
  withCredentials: true, // 쿠키를 요청에 자동으로 포함시킴 (Refresh Token이 쿠키에 저장돼 있을 때 필요)
});

// 요청 시 accessToken 자동 삽입
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // 헤더에 Bearer 토큰 삽입
  }
  return config;
});

// 응답 에러 시 401 → refresh 토큰으로 재시도
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config; // 무한 루프 방지용 플래그 설정

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      // TODO: refresh로직 다시 보기 오류 발생함
      try {
        const refreshRes = await axios.post('/api/auth/refresh', null, {
          withCredentials: true, // 쿠키 포함해서 보냄
        });

        const newAccessToken = refreshRes.data.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken); // 상태 업데이트
        axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`; // 기본 axios 인스턴스에 토큰 추가
        original.headers.Authorization = `Bearer ${newAccessToken}`; // 실패한 요청에 토큰 다시 설정

        return axios(original); // 실패한 요청 다시 실행
      } catch (refreshErr) {
        useAuthStore.getState().clear(); // 상태 초기화
        window.location.href = '/auth'; // 로그인 페이지로 강제 이동
        return Promise.reject(refreshErr); // 에러 반환
      }
    }

    // 반환 값 401일 때는 로그인으로 redirect
    if (err.response?.status === 401) {
      useAuthStore.getState().clear(); // 상태 초기화
      localStorage.removeItem('auth-storage'); // 로컬스토리지 삭제 (Zustand persist용)
      window.location.href = '/auth'; // 로그인 페이지 이동
    }

    return Promise.reject(err); // 최종적으로 에러 반환
  },
);

export default api;
