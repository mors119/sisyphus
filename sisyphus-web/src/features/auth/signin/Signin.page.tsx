import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

import { SigninForm } from '../auth.types';
import { useTranslation } from 'react-i18next';
import { useSigninMutation } from './useSigninMutation.mutation';
import { useAlert } from '@/hooks/useAlert';
import { PATHS } from '@/app/router/paths.constants';
import { useSigninSchema } from '../auth.schema';

const Signin = () => {
  const [initialEmail, setInitialEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { alertMessage } = useAlert();
  const { t } = useTranslation();
  const signinSchema = useSigninSchema();
  const from = location.state?.from || PATHS.HOME; // 들어온 페이지로 리다이렉트 없으면 홈으로
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 페이지 이동 중 접근 거부 시
    // 'alert' 파라미터의 값이 'auth_required'인지 확인
    if (searchParams.get('alert') === 'auth_required') {
      // 조건에 맞으면 알림 메시지를 띄움
      alertMessage(t('access.restrictions'), {
        description: t('auth.required'),
        duration: 2000,
      });
      // 알림을 띄운 후에는 URL에서 쿼리 파라미터를 제거하여, 페이지를 새로고침해도 알림이 다시 뜨지 않도록 함
      searchParams.delete('alert');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, alertMessage, t]);

  const form = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: initialEmail,
      password: '',
    },
    shouldUnregister: false,
  });

  const signinMutation = useSigninMutation(
    () => navigate(from, { replace: true }),
    (email) => {
      setInitialEmail(email);
      form.reset({ email, password: '' });
    },
  );

  const onSubmit = (values: SigninForm) => {
    setIsLoading(true);
    signinMutation.mutate(values, {
      onSettled: () => setIsLoading(false),
    });
  };

  return (
    <div className="flex flex-col justify-center items-center h-full mx-auto w-full ">
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
                <FormLabel>{t('signin.email')}</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="email"
                    placeholder={t('signin.email')}
                    {...field}
                  />
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
                <FormLabel>{t('signin.pass')}</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="current-password"
                    type="password"
                    placeholder={t('signin.pass')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full " disabled={isLoading}>
            {t('signin.signin')}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Signin;
