import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/auth.store';
import { useUserQuery } from './useUser.query';

/**
 * 최초 로딩 시 유저 정보 가져오기
 *
 * @returns accessToken - 인증 토큰
 * @returns user - finalUser = 스토어 유저 정보 ?? 새로 불러온 유저 정보 ?? null
 * @returns isLoading - 로딩 (새로 불러올 유저)
 */
export const useUserHydration = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clear = useAuthStore((state) => state.clear);

  const [hydrated, setHydrated] = useState(false);

  const { data, isLoading } = useUserQuery();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!accessToken && data) {
      // 액세스 토큰은 없는데, 사용자 정보가 있다? → 상태가 꼬임
      clear(); //  상태 꼬임 방지: Zustand + React Query 초기화
    }
    if (data && hydrated && !user && accessToken) {
      setUser(data); // user가 없을 때만 설정
    }
  }, [data, hydrated, user, setUser, accessToken, clear]);

  const finalUser = data ?? user ?? null;

  return {
    accessToken,
    user: finalUser,
    isLoading,
  };
};
