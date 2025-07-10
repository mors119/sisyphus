import { useAlert } from '@/hooks/useAlert';
import { useMutation } from '@tanstack/react-query';
import { checkApi, sendVerificationCode, signupApi } from '../auth.api';
import { SignupForm } from '../auth.types';
import { useFormContext } from 'react-hook-form';
import { useAuthStore } from '../auth.store';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// 아이디 체크
export const useCheckEmailMutation = (onSuccess: () => void) => {
  const { alertMessage } = useAlert();
  const form = useFormContext<SignupForm>();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: checkApi,
    onSuccess: (res, variables) => {
      if (res.data === true) {
        alertMessage(t('signup.msg.duplicate'), { duration: 3000 });
        form.setValue('email', '');
      } else {
        onSuccess();
        alertMessage(t('signup.msg.available'), {
          description: variables.email,
          duration: 3000,
        });
      }
    },
    onError: () => {
      alertMessage(t('signup.msg.error.check'), { duration: 3000 });
    },
  });
};

// 이메일 인증 코드 전송
export const useSendVerificationMutation = () => {
  const { alertMessage } = useAlert();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: sendVerificationCode,
    onSuccess: () => {
      alertMessage(t('signup.msg.sent'));
    },
    onError: () => {
      alertMessage(t('signup.msg.error.send'));
    },
  });
};

// 회원가입 폼 제출
export const useSignupMutation = (onSuccess: () => void) => {
  const { alertMessage } = useAlert();
  const { setAccessToken } = useAuthStore();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: signupApi,
    onSuccess: (res) => {
      const accessToken = res.data.accessToken;

      setAccessToken(accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      alertMessage(t('signup.msg.success.title'), {
        description: t('signup.msg.success.desc'),
        duration: 3000,
      });

      onSuccess();
    },
    onError: () => {
      alertMessage(t('signup.msg.error.ing'), { duration: 3000 });
    },
  });
};
