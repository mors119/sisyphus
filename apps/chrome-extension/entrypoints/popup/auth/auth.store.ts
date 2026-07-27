import { create } from 'zustand';

type AuthState = {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clear: () => void;
};

export const clearLegacyAuthStorage = () => {
  localStorage.removeItem('auth-storage');
  localStorage.removeItem('accessToken');
  void chrome.storage.local.remove(['accessToken', 'auth-storage']);
};

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  clear: () => {
    set({ accessToken: null });
    clearLegacyAuthStorage();
  },
}));
