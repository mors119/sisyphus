import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/auth.store';
import { useUserQuery } from './useUser.query';

/**
 * 최초 로딩 시 유저 정보 가져오기
 *
 * @returns accessToken - 인증 토큰
 * @returns user - React Query data ?? auth store user ?? null
 * @returns isLoading - 로딩 (새로 불러올 유저)
 */
export const useUserHydration = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clear = useAuthStore((state) => state.clear);

  const { data, isLoading } = useUserQuery();

  useEffect(() => {
    if (!accessToken && data) {
      clear();
    }
  }, [data, accessToken, clear]);

  useEffect(() => {
    if (data && accessToken && !user) {
      setUser(data);
    }
  }, [data, accessToken, user, setUser]);

  const resolvedUser = data ?? user ?? null;

  return {
    accessToken,
    user: resolvedUser,
    isLoading: Boolean(accessToken && isLoading && !resolvedUser),
  };
};
