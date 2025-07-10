import { useTranslation } from 'react-i18next';
import z from 'zod';

export const useAuthSchema = () => {
  const { t } = useTranslation();

  const authSchema = z.object({
    email: z
      .string()
      .min(1, { message: t('main.auth.email_err') })
      .email(),
    password: z.string().min(8, { message: t('main.auth.password_err') }),
    provider: z.string(),
  });
  return authSchema;
};

export type AuthRequest = z.infer<ReturnType<typeof useAuthSchema>>;
