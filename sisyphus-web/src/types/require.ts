export enum RequireStatus {
  RECEIVED = 'RECEIVED', // 접수
  IN_PROGRESS = 'IN_PROGRESS', // 처리 중
  COMPLETED = 'COMPLETED', // 완료
  REJECTED = 'REJECTED', // 거절
}

export interface RequireResponse {
  id: number;
  title: string;
  userEmail: string;
  description: string;
  status: RequireStatus;
  createdAt: string;
  updatedAt: string;
  comments: RequireComment;
}

// 페이징 응답 타입
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
}

export interface RequireComment {
  id: number;
  content: string;
  userEmail: string;
  createdAt: string;
  update: string;
}
