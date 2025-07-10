import { z } from 'zod';

export const useNoteSchema = () => {
  const noteSchema = z.object({
    title: z.string().min(1, { message: '제목은 필수 입력사항 입니다.' }),
    subTitle: z.string().optional(),
  });
  return noteSchema;
};
export type NoteRequest = z.infer<ReturnType<typeof useNoteSchema>>;
