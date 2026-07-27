import { RequireStatus } from './require.types';

import type { badgeVariants } from '@/components/ui/badge';
import type { VariantProps } from 'class-variance-authority';

export type StatusKey = keyof typeof STATUS_LABELS;

type StatusBadgeVariant = NonNullable<
  VariantProps<typeof badgeVariants>['variant']
>;

export const STATUS_LABELS = {
  RECEIVED: ['require.status.received', 'warning'],
  IN_PROGRESS: ['require.status.inProgress', 'default'],
  COMPLETED: ['require.status.completed', 'success'],
  REJECTED: ['require.status.rejected', 'destructive'],
} as const satisfies Record<
  RequireStatus,
  [translationKey: string, badgeVariant: StatusBadgeVariant]
>;

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
