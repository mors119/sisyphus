// user dto
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
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
  provider: 'google' | 'naver' | 'camus' | string; // 필요에 따라 string 또는 enum으로
}
