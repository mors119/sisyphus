import { z } from 'zod';

const tagTempSchema = z.object({
  id: z.number(),
  name: z.string(),
});

// note, category
export const noteSchema = z.object({
  title: z.string().min(1, { message: '제목을 입력해주세요.' }),
  subTitle: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(tagTempSchema),
  categoryId: z.number().nullable().optional(),
  imageId: z.number().nullable().optional(),
});
