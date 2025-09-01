import { z } from 'zod';
import { useSigninSchema, useSignupSchema } from './auth.schema';

// role
export type UserRole = 'ADMIN' | 'USER';

// roles (sidenav constants type)
export type UserRoles = 'ADMIN' | 'USER' | 'ALL';

// 로그인
export type SigninForm = z.infer<ReturnType<typeof useSigninSchema>>;

// 회원가입
export type SignupForm = z.infer<ReturnType<typeof useSignupSchema>>;
