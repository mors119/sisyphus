import { useMutation } from '@tanstack/react-query';
import { userDeleteApi, userUpdateApi } from './user.api';
import { useAuthStore } from '@/features/auth/auth.store';

export const useUserDeleteMutation = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: userDeleteApi,
    onSuccess: () => {
      useAuthStore.getState().clear();
      onSuccess();
    },
    onError: () => {
      alert('error');
    },
  });
};

export const useUserUpdateMutation = () => {
  return useMutation({
    mutationFn: (data: { name: string }) => userUpdateApi(data),
  });
};
