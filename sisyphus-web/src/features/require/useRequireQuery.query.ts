import {
  countRequireStatus,
  createRequire,
  deleteRequire,
  fetchMyRequires,
  fetchRequire,
  updateRequire,
  updateRequireStatus,
} from '@/features/require/require.api';

import { invalidateQuery, removeQuery } from '@/lib/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import { RequireForm } from './require.types';

export const useMyRequiresQuery = (page: number, size: number = 10) => {
  return useQuery({
    queryKey: ['requires', page, size],
    queryFn: () => fetchMyRequires(page, size),
    staleTime: 1000 * 5,
  });
};

export const useRequireQuery = (
  id: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['require', id],
    queryFn: () => fetchRequire(id),
    enabled: options?.enabled ?? true,
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

export const useUpdateRequireMutation = (opts?: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: (data: RequireForm & { id: number }) => updateRequire(data),
    onSuccess: () => {
      invalidateQuery(['requires']); // 전체 노트 리스트 새로고침
      opts?.onSuccess?.();
    },
    onError: (error) => {
      console.error('요청사항 업데이트 실패:', error);
    },
  });
};

export const useDeleteRequireMutation = (opts?: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: deleteRequire,
    onSuccess: (_data, id) => {
      invalidateQuery(['requires']);
      removeQuery(['require', id]);
      opts?.onSuccess?.();
    },
  });
};

export const useRequireStatusUpdateMutation = (opts?: {
  onSuccess?: () => void;
  onError?: (err: Error) => void;
}) => {
  return useMutation({
    mutationFn: updateRequireStatus,
    onSuccess: () => {
      invalidateQuery(['requires']);
      opts?.onSuccess?.();
    },
    onError: (err) => {
      opts?.onError?.(err);
    },
  });
};

export const useRequireCountQuery = () => {
  return useQuery({
    queryKey: ['requireCount'],
    queryFn: () => countRequireStatus(),
    staleTime: 30 * 10000,
  });
};
