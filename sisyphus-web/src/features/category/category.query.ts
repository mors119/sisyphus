import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from './category.api';
import { useAuthStore } from '../auth/auth.store';

// category 전체 가져오기
export const useCategoriesQuery = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    enabled: !!accessToken,
  });
};
