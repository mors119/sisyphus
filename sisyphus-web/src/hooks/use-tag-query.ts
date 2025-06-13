import {
  createTag,
  deleteTag,
  fetchTags,
  updateTag,
} from '@/services/tag/route';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { TagForm } from '@/lib/validations/tag';

// tag 전체 가져오기
export const useTagsQuery = () =>
  useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });

export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TagForm) => createTag(data),
    onSuccess: () => {
      // 태그 목록 리패칭
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export const useDeleteTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export const useUpdateTagMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TagForm) => updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] }); // refetch
    },
  });
};
