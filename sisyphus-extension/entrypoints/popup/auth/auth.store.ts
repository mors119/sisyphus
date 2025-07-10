import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (token) => {
        set({ accessToken: token });
        chrome.storage.local.set({ accessToken: token });
      },
      clear: () => {
        set({ accessToken: null });
        chrome.storage.local.remove('accessToken');
      },
    }),
    {
      name: 'auth-storage', // 로컬 스토리지 또는 스토리지 엔진에 저장될 key 이름
    },
  ),
);
