import { useMutation } from '@tanstack/react-query';
import { invalidateQuery, refetchQuery } from '@/lib/react-query';
import { createCategory, deleteCategory, updateCategory } from './category.api';
import { CategoryForm } from './category.types';
import { useTranslation } from 'react-i18next';
import { useAlert } from '@/hooks/useAlert';

export const useUpdateCategoryMutation = (id: number) => {
  const { t } = useTranslation();
  const { alertMessage } = useAlert();
  return useMutation({
    mutationFn: (data: CategoryForm) => updateCategory(id, data),
    onSuccess: () => {
      invalidateQuery(['categories']); // refetch
      alertMessage(t('category.msg.submit.update'));
    },
  });
};

export const useCreateCategoryMutation = () => {
  const { t } = useTranslation();
  const { alertMessage } = useAlert();
  return useMutation({
    mutationFn: (data: CategoryForm) => createCategory(data),
    onSuccess: () => {
      invalidateQuery(['categories']);
      alertMessage(t('category.msg.submit.create'));
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const { t } = useTranslation();
  const { alertMessage } = useAlert();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      refetchQuery(['categories']);
      alertMessage(t('category.msg.submit.delete'));
    },
  });
};
