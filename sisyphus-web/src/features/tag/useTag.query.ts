import { useQuery } from '@tanstack/react-query';
import { fetchTags } from './tag.api';
import { useAuthStore } from '@/features/auth/auth.store';
import { TagResponse } from './tag.type';

export const useFetchTags = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<TagResponse[]>({
    queryKey: ['tags'],
    queryFn: fetchTags,
    enabled: !!accessToken,
  });
};
