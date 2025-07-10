import { useForm } from 'react-hook-form';
import { AuthRequest, useAuthSchema } from './auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from './auth.store';
import { loginApi } from './auth.api';

export const useAuthHook = () => {
  const authSchema = useAuthSchema();
  const { setAccessToken } = useAuthStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthRequest>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
      provider: 'CAMUS',
    },
  });

  const loginMutation = useMutation({
    mutationFn: (req: AuthRequest) => loginApi(req),
    onSuccess: (res) => {
      if (res.accessToken) {
        setAccessToken(res.accessToken);
        reset();
      }
    },
    onError: (err) => {
      console.error('서버 에러:', err);
    },
  });

  const onSubmit = (req: AuthRequest) => {
    loginMutation.mutate(req);
    console.log(req);
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting: loginMutation.isPending || isSubmitting,
    submitError: loginMutation.error?.name,
  };
};
