import { RequireStatus } from './require.types';

export const STATUS_LABELS = {
  RECEIVED: ['require.status.received', 'bg-warning text-white'],
  IN_PROGRESS: ['require.status.inProgress', 'bg-info text-white'],
  COMPLETED: ['require.status.completed', 'bg-success text-white'],
  REJECTED: ['require.status.rejected', 'bg-danger text-white'],
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
