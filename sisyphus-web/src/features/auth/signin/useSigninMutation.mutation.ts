import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAlert } from '@/hooks/useAlert';
import { loginApi } from '../auth.api';
import { useAuthStore } from '../auth.store';
import { SigninForm } from '../auth.types';
import { Provider } from '@/features/user/user.types';
import { useTranslation } from 'react-i18next';

export const useSigninMutation = (
  onSuccessRedirect: () => void,
  onFailureReset: (email: string) => void,
) => {
  const { alertMessage } = useAlert();
  const { setAccessToken, clear } = useAuthStore();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (formData: SigninForm) =>
      loginApi({ ...formData, provider: Provider.CAMUS }),
    onSuccess: (res) => {
      clear(); // 로그인 전에 항상 초기화

      const accessToken = res.data?.accessToken;
      if (!accessToken) {
        alertMessage(t('auth.false'), { duration: 3000 });
        return;
      }

      setAccessToken(accessToken);

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      alertMessage(t('auth.success'), { duration: 2000 });
      onSuccessRedirect();
    },
    onError: (_, variables) => {
      alertMessage(t('auth.false'), { duration: 3000 });
      onFailureReset(variables.email);
    },
  });
};
