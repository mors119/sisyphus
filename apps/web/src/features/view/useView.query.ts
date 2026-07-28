import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchNotes } from './view.api';
import { NotePageResponse, SortOption } from '../quick_edit/note.types';
import { useAuthStore } from '../auth/auth.store';

type NotesParams = {
  sortOption: SortOption;
  categoryId?: number | null;
  tagId?: number | null;
  tit?: string | null;
  size?: number;
  enabled?: boolean;
};

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

export const useNotesInfiniteQuery = ({
  sortOption,
  categoryId = null,
  tagId = null,
  tit = null,
  size = 10,
  enabled,
}: NotesParams) => {
  const { accessToken } = useAuthStore();

  return useInfiniteQuery<NotePageResponse, Error>({
    // role: 캐시 키(필터/정렬 바뀌면 새로 조회), type: unknown[]
    queryKey: [
      'notes',
      sortOption.field,
      sortOption.order,
      categoryId,
      tagId,
      tit,
      size,
    ],

    // role: 첫 페이지, type: number
    initialPageParam: 0,

    // role: 페이지 요청 함수, type: ({pageParam}) => Promise<NotePageResponse>
    queryFn: ({ pageParam }) =>
      fetchNotes({
        page: typeof pageParam === 'number' ? pageParam : 0,
        size,
        sortOption,
        categoryId: categoryId ?? undefined,
        tagId: tagId ?? undefined,
        tit: tit ?? undefined,
      }),

    // role: 다음 페이지 계산, type: (lastPage) => number | undefined
    getNextPageParam: (lastPage) => {
      const page = Number(lastPage.page ?? 0);
      return lastPage.last ? undefined : page + 1;
    },

    staleTime: 1000 * 60,
    enabled: !!accessToken && (enabled ?? true),
  });
};
