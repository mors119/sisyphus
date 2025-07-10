import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './auth.store';
import { logoutApi } from './auth.api';
import { PATHS } from '@/app/router/paths.constants';
import { clearQueryCache, resetQuery } from '@/lib/react-query';

// logout
export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const { clear } = useAuthStore();

  return useMutation({
    mutationFn: logoutApi,
    /*
     * onSuccess: 뮤테이션이 성공했을 때만 실행
     * onError: 뮤테이션이 실패했을 때만 실행
     * onSettled: 성공하든 실패하든 관계없이 뮤테이션이 완료되면 항상 실행
     */
    onSettled: () => {
      clearQueryCache();

      resetQuery();

      clear();

      localStorage.removeItem('auth-storage');

      navigate(PATHS.HOME);
    },
  });
};
