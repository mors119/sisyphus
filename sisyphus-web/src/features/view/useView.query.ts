import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchNotes, fetchCategoryNullNotes } from './view.api';
import { NotePageResponse, SortOption } from '../quick_edit/note.types';
import { useAuthStore } from '../auth/auth.store';

// 노트 전체 상태
export const useNotesQuery = (
  page: number,
  sortOption: SortOption,
  categoryId?: number | null,
  tagId?: number | null,
  tit?: string | null,
) => {
  const { accessToken } = useAuthStore();
  return useQuery<NotePageResponse, Error>({
    queryKey: ['notes', page, sortOption, categoryId, tagId, tit],
    queryFn: () =>
      fetchNotes({
        page,
        size: 10,
        sortOption,
        categoryId,
        tagId,
        tit,
      }),
    staleTime: 1000 * 60, // 1분 정도는 fresh 처리
    enabled: !!accessToken,
  });
};

// 태그가 없는 노트 전체
export const useCategoryNullNotesQuery = () => {
  return useInfiniteQuery<NotePageResponse, Error>({
    queryKey: ['categoryNullNotes'],
    initialPageParam: 0, // 필수 추가 (v5 요구)
    queryFn: ({ pageParam }) =>
      fetchCategoryNullNotes({
        page: typeof pageParam === 'number' ? pageParam : 0,
        size: 10,
        sortOption: { field: 'createdAt', order: 'asc' },
      }),
    getNextPageParam: (lastPage) => {
      const currentPage = typeof lastPage.page === 'number' ? lastPage.page : 0;
      return lastPage.last ? undefined : currentPage + 1;
    },
  });
};
