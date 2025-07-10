import { useAuthStore } from '@/features/auth/auth.store';
import { useQuery } from '@tanstack/react-query';
import { UserResponse, UserWithAccountResponse } from './user.types';
import { fetchUser, userDetailApi } from './user.api';

export const useUserQuery = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<UserResponse, Error>({
    queryKey: ['user'],
    queryFn: fetchUser,
    enabled: !!accessToken,
  });
};

export const useUserDetailQuery = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<UserWithAccountResponse>({
    queryKey: ['user', 'detail'],
    queryFn: userDetailApi,
    enabled: !!accessToken,
  });
};
