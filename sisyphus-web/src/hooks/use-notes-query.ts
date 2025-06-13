import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import {
  deleteNote,
  fetchNote,
  fetchNotes,
  fetchTagNullNotes,
  updateNote,
} from '@/services/note/route';
import {
  Category,
  NotePageResponse,
  NoteRequest,
  NoteResponse,
  SortOption,
} from '@/types/note';

// 노트 전체 상태 (스크롤)
export const useInfiniteNotesQuery = (
  category: Category,
  sortOption: SortOption,
) => {
  return useInfiniteQuery<NotePageResponse, Error>({
    queryKey: ['notes', category, sortOption],
    initialPageParam: 0, // 필수 추가 (v5 요구)
    queryFn: ({ pageParam }) =>
      fetchNotes({
        page: typeof pageParam === 'number' ? pageParam : 0,
        size: 10,
        category,
        sortOption,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.pageable.pageNumber + 1,
  });
};

// 태그가 없는 노트 전체
export const useTagNullNotesQuery = (category: Category) => {
  return useInfiniteQuery<NotePageResponse, Error>({
    queryKey: ['tagNullNotes', category],
    initialPageParam: 0, // 필수 추가 (v5 요구)
    queryFn: ({ pageParam }) =>
      fetchTagNullNotes({
        page: typeof pageParam === 'number' ? pageParam : 0,
        size: 10,
        category,
        sortOption: { field: 'createdAt', order: 'asc' },
      }),
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.pageable.pageNumber + 1,
  });
};

export const useNoteQuery = (noteId: number) => {
  return useQuery<NoteResponse>({
    queryKey: ['note', noteId],
    queryFn: () => fetchNote(noteId),
    enabled: !!noteId, // noteId가 0, null, undefined일 때 호출 방지
  });
};

// 노트 삭제
export const useDeleteNoteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      // 성공 시 자동 리패칭
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

// 노트 업데이트
export const useUpdateNoteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: NoteRequest }) =>
      updateNote({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] }); // 전체 노트 리스트 새로고침
    },
    onError: (error) => {
      console.error('노트 업데이트 실패:', error);
    },
  });
};
