import { z } from 'zod';

export const tagSchema = z.object({
  title: z.string().min(1, '태그명을 입력해주세요.'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, '유효한 HEX 색상코드여야 합니다.'),

  parentId: z
    .union([z.string().regex(/^\d+$/), z.literal(''), z.number()]) // ''도 허용
    .transform((val) => (val === '' ? null : Number(val)))
    .nullable()
    .optional(),
});

export type TagForm = z.infer<typeof tagSchema>;
