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
  file: z
    .instanceof(File)
    .refine((file) => file.size < 5 * 1024 * 1024, {
      message: '5MB 이하 이미지만 업로드 가능해요.',
    })
    .refine((file) => file.type.startsWith('image/'), {
      message: '이미지 파일만 허용됩니다.',
    }),
});
