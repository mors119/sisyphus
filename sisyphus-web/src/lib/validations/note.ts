import { z } from 'zod';

// note, tag
export const noteSchema = z.object({
  title: z.string().min(1, { message: '제목을 입력해주세요.' }),
  subTitle: z.string().optional(),
  description: z.string().optional(),
  tagId: z.number().nullable().optional(),
  category: z.enum(['WORD', 'NOTE', 'TODO'], {
    required_error: '카테고리를 선택해주세요.',
  }),
});

export type NoteForm = z.infer<typeof noteSchema>;

// tag_id: z.string().transform((val) => Number(val)),
// tag_title: z.string().optional(),
// tag_color: z
//   .string()
//   .min(7)
//   .regex(/^#[0-9A-Fa-f]{6}$/, { message: '유효한 HEX 색상코드여야 합니다.' })
//   .optional(),
