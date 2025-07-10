import { create } from 'zustand';
// zustand + persist = zustand가 자동으로 localStorage 저장
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { UserResponse } from '../user/user.types';
import { clearQueryCache } from '@/lib/react-query';

interface AuthState {
  accessToken: string | null;
  user: UserResponse | null;
  setAccessToken: (token: string) => void;
  setUser: (user: UserResponse) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    // redux devtool 사용하기
    persist(
      (set) => ({
        accessToken: null,
        user: null,
        setAccessToken: (token) => set({ accessToken: token }),
        setUser: (user) => set({ user }),
        clear: () => {
          set({ user: null, accessToken: null });
          localStorage.removeItem('auth-storage');
          clearQueryCache();
        },
      }),
      {
        name: 'auth-storage', // localStorage key 이름
        storage: createJSONStorage(() => localStorage), // 기본 storage (sessionStorage로도 바꿀 수 있음)
        partialize: (state) => ({ accessToken: state.accessToken }), // 토큰 값만 persist, user는 persist하지 않음
      },
    ),
    {
      name: 'AuthStore',
      enabled: process.env.NODE_ENV === 'development',
    },
  ),
);
