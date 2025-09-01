import { useQuery } from '@tanstack/react-query';
import { fetchRequireAll, fetchUserCount } from './dashboard.api';
import { UserAndAccount } from './dashboard.type';

export const useFetchRequire = (page: number, size: number = 10) => {
  return useQuery({
    queryKey: ['requires', page, size],
    queryFn: () => fetchRequireAll(page, size),
    staleTime: 1000 * 5,
  });
};

export const useUserAndAccount = () => {
  return useQuery<UserAndAccount>({
    queryKey: ['userCount'],
    queryFn: fetchUserCount,
    staleTime: 1000 * 60,
  });
};
