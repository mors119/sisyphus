import { useAuthStore } from '../auth/auth.store';

// 앱 진입 시 한 번만 실행
export const initAccessToken = async () => {
  chrome.storage.local.get('accessToken', (result) => {
    const token = result.accessToken;
    if (token) {
      useAuthStore.getState().setAccessToken(token);
    }
  });
};
