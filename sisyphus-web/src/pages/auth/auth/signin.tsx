import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/services/route';
import { useAuthStore } from '@/stores/auth-store';

import { useAlert } from '@/hooks/use-alert';
import { loginApi } from '@/services/auth/route';
import { SigninForm, signinSchema } from '@/lib/validations/signin';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const Signin = () => {
  const [initialEmail, setInitialEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/'; // 들어온 페이지로 리다이렉트 없으면 홈으로

  const { alertMessage } = useAlert();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: initialEmail,
      password: '',
    },
    shouldUnregister: false,
  });

  const onSubmit = async (values: SigninForm) => {
    useAuthStore.getState().clear();
    localStorage.removeItem('auth-storage');

    const { email, password } = values;

    setIsLoading(true);
    try {
      const provider = 'camus';
      const res = await loginApi({ email, password, provider });

      const { accessToken } = res.data;

      // 상태에 저장
      useAuthStore.getState().setAccessToken(accessToken);

      // 이후 요청에 토큰 자동 포함
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // 리다이렉트
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      alertMessage('로그인 실패!', { duration: 3000 });

      // 실패 후에도 이메일은 유지
      setInitialEmail(form.getValues('email')); // email 유지
      form.reset({ email: form.getValues('email'), password: '' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full mx-auto w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-[320px]">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full " disabled={isLoading}>
            로그인
          </Button>
        </form>
      </Form>
    </div>
  );
};
