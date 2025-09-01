import { z } from 'zod';
import { useTranslation } from 'react-i18next';

// 로그인
export const useSigninSchema = () => {
  const { t } = useTranslation();

  return z.object({
    email: z
      .string()
      .min(1, { message: t('signin.msg.email.required') })
      .email({ message: t('signin.msg.email.invalid') }),
    password: z
      .string()
      .min(8, { message: t('signin.msg.password.min') })
      .regex(/[0-9]/, { message: t('signin.msg.password.number') }),
  });
};

// 회원가입
export const useSignupSchema = () => {
  const { t } = useTranslation();

  return z
    .object({
      name: z
        .string()
        .min(1, { message: t('signup.msg.signup.name.required') }),
      email: z
        .string()
        .min(1, { message: t('signup.msg.signup.email.required') })
        .email({ message: t('signup.msg.signup.email.invalid') }),
      password: z
        .string()
        .min(8, { message: t('signup.msg.signup.password.min') })
        .regex(/[0-9]/, { message: t('signup.msg.signup.password.number') })
        .regex(/[!@#$%^&*()_\-+=<>?{}[\]~]/, {
          message: t('signup.msg.signup.password.special'),
        }),
      passwordConfirm: z
        .string()
        .min(1, { message: t('signup.msg.signup.passwordConfirm.required') }),
      age: z.boolean().default(false).optional(),
      checkBox1: z.boolean().default(false).optional(),
      checkBox2: z.boolean().default(false).optional(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      path: ['passwordConfirm'],
      message: t('signup.msg.signup.passwordConfirm.mismatch'),
    });
};

// 이메일 인증
export const useEmailVerifySchema = () => {
  const { t } = useTranslation();

  return z.object({
    email: z.string().email({ message: t('signup.msg.verify.email.invalid') }),
    code: z.string().min(6, { message: t('signup.msg.verify.code.min') }),
  });
};
