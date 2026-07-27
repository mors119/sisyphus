import { create } from 'zustand';
import { UserResponse } from '../user/user.types';
import { clearQueryCache } from '@/lib/react-query';

export type AuthStatus = 'bootstrapping' | 'authenticated' | 'unauthenticated';

interface AuthState {
  accessToken: string | null;
  user: UserResponse | null;
  status: AuthStatus;
  setAccessToken: (token: string) => void;
  setUser: (user: UserResponse) => void;
  setUnauthenticated: () => void;
  clear: () => void;
}

export const clearLegacyAuthStorage = () => {
  localStorage.removeItem('auth-storage');
  localStorage.removeItem('accessToken');
};

export const useAuthStore = create<AuthState>()(
  (set) => ({
    accessToken: null,
    user: null,
    status: 'bootstrapping',
    setAccessToken: (token) =>
      set({ accessToken: token, status: 'authenticated' }),
    setUser: (user) => set({ user }),
    setUnauthenticated: () =>
      set({ user: null, accessToken: null, status: 'unauthenticated' }),
    clear: () => {
      set({ user: null, accessToken: null, status: 'unauthenticated' });
      clearLegacyAuthStorage();
      clearQueryCache();
    },
  }),
);
