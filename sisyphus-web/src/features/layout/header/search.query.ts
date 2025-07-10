import { useDebounce } from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { SearchResponse } from './search.type';
import { searchApi } from './search.api';

export const useSearchQuery = (query: string) => {
  const debouncedQuery = useDebounce(query, 500);

  return useQuery<SearchResponse[]>({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchApi(debouncedQuery),
    enabled: debouncedQuery.length > 1, // 2자 이상 입력할 때만 요청
  });
};
