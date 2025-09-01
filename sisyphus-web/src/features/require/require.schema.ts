import { z } from 'zod';
import { RequireCate } from './require.types';
import { TFunction } from 'i18next';

export const requireSchema = (t: TFunction) =>
  z.object({
    requireType: z.nativeEnum(RequireCate),
    title: z.string().min(1, { message: t('require.query.tit') }),
    description: z.string().min(1, { message: t('require.query.desc') }),
  });
