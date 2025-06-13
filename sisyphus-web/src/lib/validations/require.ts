import { z } from 'zod';

export const requireSchema = z.object({
  id: z.number().optional().nullable(),
  title: z.string().min(1, '제목을 입력해주세요.'),
  description: z.string().min(1, '내용을 입력해주세요.'),
});

export type RequireForm = z.infer<typeof requireSchema>;
