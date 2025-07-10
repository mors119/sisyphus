import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export const useUserSchema = () => {
  const { t } = useTranslation();

  return z.object({
    name: z.string().min(2, t('user.create.name')),
    email: z.string().email(t('user.create.email')),
    createdAt: z.string(), // readonly라면 validation에서는 제외해도 됨
  });
};
