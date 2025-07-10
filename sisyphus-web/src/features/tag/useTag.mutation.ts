import { useMutation } from '@tanstack/react-query';
import { createTag, deleteTag, updateTag } from './tag.api';
import { TagRequest } from './tag.type';

export const useCreateTagMutation = () => {
  return useMutation({
    mutationFn: (data: { name: string }[]) => createTag(data),
  });
};

export const useUpdateTagMutation = () => {
  return useMutation({
    mutationFn: (data: TagRequest) => updateTag({ data }),
    onSuccess: () => {},
  });
};

export const useDeleteTagMutation = () => {
  return useMutation({
    mutationFn: (ids: number[]) => deleteTag(ids),
    onSuccess: () => {},
  });
};
