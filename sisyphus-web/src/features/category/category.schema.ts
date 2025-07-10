import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export const useCategorySchema = () => {
  const { t } = useTranslation();
  return z.object({
    title: z.string().min(1, t('category.msg.schema.title')),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, t('category.msg.schema.color')),
  });
};
