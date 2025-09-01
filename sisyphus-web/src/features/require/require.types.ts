import { z } from 'zod';
import { requireSchema } from './require.schema';

export enum RequireStatus {
  RECEIVED = 'RECEIVED', // 접수
  IN_PROGRESS = 'IN_PROGRESS', // 처리 중
  COMPLETED = 'COMPLETED', // 완료
  REJECTED = 'REJECTED', // 거절
}

export enum RequireCate {
  Bug = 'BUG',
  New = 'NEW',
}

export interface StatusCountResponse {
  status: RequireStatus;
  count: number;
  month: number;
}

export interface RequireStatusRequest {
  id: number;
  status: RequireStatus;
}

export interface RequireResponse {
  id: number;
  requireType: RequireCate;
  title: string;
  userEmail: string;
  description: string;
  status: RequireStatus;
  createdAt: string;
  updatedAt: string;
  comments: RequireComment[];
}

interface RequireComment {
  id: number;
  content: string;
  userEmail: string;
  createdAt: string;
  update: string;
}

export type RequireForm = z.infer<ReturnType<typeof requireSchema>>;
