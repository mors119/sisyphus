import { z } from 'zod';

// 회원가입
export const signupSchema = z
  .object({
    name: z.string().min(1, { message: '이름이나 별명을 입력하세요.' }),
    email: z
      .string()
      .min(1, { message: '이메일을 입력하세요' })
      .email({ message: '올바른 이메일 형식이 아닙니다' }),
    password: z
      .string()
      .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })
      .regex(/[0-9]/, { message: '하나 이상의 숫자를 포함해야 합니다' })
      .regex(/[!@#$%^&*()_\-+=<>?{}[\]~]/, {
        message: '하나 이상의 특수문자를 포함해야 합니다',
      }),
    passwordConfirm: z
      .string()
      .min(1, { message: '비밀번호 확인이 필요합니다' }),
    checkBox1: z.boolean().default(false).optional(),
    checkBox2: z.boolean().default(false).optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다',
  });

export type SignupForm = z.infer<typeof signupSchema>;

// 이메일 검증
export const EmailVerifySchema = z.object({
  email: z.string().email(),
  code: z.string().min(6),
});

export type EmailVerifyForm = z.infer<typeof EmailVerifySchema>;
