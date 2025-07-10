import {
  createRequire,
  fetchMyRequires,
  fetchRequire,
  updateRequire,
} from '@/features/require/require.api';

import { invalidateQuery } from '@/lib/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useMyRequiresQuery = (page: number, size: number = 10) => {
  return useQuery({
    queryKey: ['requires', page, size],
    queryFn: () => fetchMyRequires(page, size),
    staleTime: 1000 * 5,
  });
};

export const useRequireQuery = (id: number) => {
  return useQuery({
    queryKey: ['require', id],
    queryFn: () => fetchRequire(id),
    enabled: !!id,
  });
};

export const useCreateMutation = () => {
  return useMutation({
    mutationFn: (data: RequireForm) => createRequire(data),
    onSuccess: () => {
      invalidateQuery(['requires']); // 목록 갱신
    },
    onError: (...args) => {
      console.error('등록 실패:', args[0]);
    },
  });
};

export const useUpdateRequireMutation = () => {
  return useMutation({
    mutationFn: (data: RequireForm) => updateRequire(data),
    onSuccess: () => {
      invalidateQuery(['requires']); // 전체 노트 리스트 새로고침
    },
    onError: (error) => {
      console.error('요청사항 업데이트 실패:', error);
    },
  });
};
