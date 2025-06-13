import { z } from 'zod';

// 로그인
export const signinSchema = z.object({
  email: z
    .string()
    .min(1, { message: '이메일을 입력하세요' })
    .email({ message: '올바른 이메일 형식이 아닙니다' }),
  password: z
    .string()
    .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })
    .regex(/[0-9]/, { message: '하나 이상의 숫자를 포함해야 합니다' }),
});

export type SigninForm = z.infer<typeof signinSchema>;
