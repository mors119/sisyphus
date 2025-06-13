import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다.'),
  email: z.string().email('유효한 이메일을 입력하세요.'),
  joinedAt: z.string(), // readonly 처리 가능
});

export type UserForm = z.infer<typeof userSchema>;
