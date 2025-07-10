import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDayjs } from '@/hooks/useDayjs.hook';
import { Provider, UserForm, UserWithAccountResponse } from './user.types';
import { useTranslation } from 'react-i18next';
import { PROVIDER_CONFIG } from './user.constants';
import { useUserForm } from './useUserForm.hook';
import { useEffect } from 'react';
import { invalidateQuery } from '@/lib/react-query';
import { useAlert } from '@/hooks/useAlert';
import { useNavigate } from 'react-router-dom';
import { useUserUpdateMutation } from './useUser.mutation';

interface Props {
  user: UserWithAccountResponse;
  read: boolean;
  setRead: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteRequest: () => void;
}

export const UserFormCard = ({
  user,
  read,
  setRead,
  onDeleteRequest,
}: Props) => {
  const { t } = useTranslation();
  const form = useUserForm();
  const updateMutation = useUserUpdateMutation();
  const { alertMessage } = useAlert();
  const navigate = useNavigate();
  const { formatDate } = useDayjs();

  // 연결된 계정 확인
  const linked = (provider: Provider) =>
    user?.accounts.some((acc) => acc.provider === provider);

  const visibleProviders = PROVIDER_CONFIG.filter((cfg) =>
    read ? linked(cfg.provider) : !linked(cfg.provider),
  );

  useEffect(() => {
    form.reset({
      name: user?.userName ?? '',
      email: user?.userEmail ?? '',
      createdAt: formatDate(user?.createdAt, 'YYYY-MM-DD') ?? '',
    });
    if (user) console.log(user.userName);
  }, [read, user, form]);

  const onSubmit = (data: UserForm) => {
    updateMutation.mutate(
      { name: data.name },
      {
        onSuccess: () => {
          setRead(true);
          invalidateQuery(['user']);
          invalidateQuery(['user', 'detail']);
          alertMessage(t('user.update.title'), {
            duration: 3000,
          });
        },
        onError: (err) => {
          console.error('업데이트 실패:', err);
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('user.name')}</FormLabel>
              <FormControl>
                <Input
                  className={cn(
                    read &&
                      'border-none shadow-none focus-visible:ring-0 focus:border-transparent disabled:opacity-100 font-bold',
                  )}
                  {...field}
                  disabled={read}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('user.email')}</FormLabel>
              <FormControl>
                <Input
                  className={cn(
                    read &&
                      'border-none shadow-none focus-visible:ring-0 focus:border-transparent disabled:opacity-100 font-bold',
                  )}
                  {...field}
                  disabled
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="createdAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('user.createdAt')}</FormLabel>
              <FormControl>
                <Input
                  className={cn(
                    read &&
                      'border-none shadow-none focus-visible:ring-0 focus:border-transparent disabled:opacity-100 font-bold',
                  )}
                  {...field}
                  disabled
                  value={field.value ?? ''}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div>
          <h4 className="mb-4 text-sm font-medium">{t('user.linked')}</h4>
          <div className="flex items-center gap-2">
            {visibleProviders.map(
              ({ provider, icon, label, className, onClick }) => (
                <Button
                  key={provider}
                  type="button"
                  variant="outline"
                  className={className}
                  onClick={() => {
                    if (onClick === 'SIGNUP') {
                      navigate('/auth/signup');
                    } else if (typeof onClick === 'string') {
                      window.location.href = `${onClick}&userId=${user.userId}`;
                    }
                  }}
                  disabled={read}>
                  {icon}
                  <span className="sm:inline-block hidden">{t(label)}</span>
                </Button>
              ),
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          {read ? (
            <Button type="button" variant="secondary" onClick={onDeleteRequest}>
              {t('user.accountDeletion')}
            </Button>
          ) : (
            <Button
              type="submit"
              variant="secondary"
              disabled={updateMutation.isPending}>
              {t('user.edit')}
            </Button>
          )}
          <Button
            type="button"
            onClick={() => {
              setRead(!read);
            }}>
            {read ? t('user.editProfile') : t('back')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
