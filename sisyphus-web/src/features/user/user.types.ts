import { z } from 'zod';
import { UserRole } from '../auth/auth.types';
import { useUserSchema } from './user.schema';

export enum Provider {
  GOOGLE = 'GOOGLE',
  NAVER = 'NAVER',
  CAMUS = 'CAMUS',
  KAKAO = 'KAKAO',
}

export type ProviderClickAction = string | 'SIGNUP';

export type ProviderConfig = {
  provider: Provider;
  icon: React.ReactNode;
  label: string;
  className?: string;
  onClick: ProviderClickAction;
};

// user dto
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

export interface UserRequest {
  name: string;
  email: string;
  password: string;
}

// 상세페이지 회원 정보
export interface UserWithAccountResponse {
  userId: number;
  userEmail: string;
  userName: string;
  createdAt: string;
  accounts: AccountInfo[];
}

// account 정보
export interface AccountInfo {
  accountId: number;
  email: string;
  provider: Provider; // 필요에 따라 string 또는 enum으로
}

// create user
export type UserForm = z.infer<ReturnType<typeof useUserSchema>>;
