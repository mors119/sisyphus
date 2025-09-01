import { RequireStatus } from './require.types';

export const STATUS_LABELS = {
  RECEIVED: ['require.status.received', 'bg-orange-400'],
  IN_PROGRESS: ['require.status.inProgress', 'bg-green-400'],
  COMPLETED: ['require.status.completed', 'bg-blue-400'],
  REJECTED: ['require.status.rejected', 'bg-rose-400'],
} as const;

export type StatusKey = keyof typeof STATUS_LABELS;

export const STATUS_FLOW: StatusKey[] = [
  'RECEIVED',
  'IN_PROGRESS',
  'COMPLETED',
  'REJECTED',
];

export const STATUS_TO_ENUM: Record<StatusKey, RequireStatus> = {
  RECEIVED: RequireStatus.RECEIVED,
  IN_PROGRESS: RequireStatus.IN_PROGRESS,
  COMPLETED: RequireStatus.COMPLETED,
  REJECTED: RequireStatus.REJECTED,
};
