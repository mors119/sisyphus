import { StepState } from '@/components/ui/progress-list';

export type ExpansionStageId =
  | 'verify-word'
  | 'definition'
  | 'image'
  | 'metadata'
  | 'persist-prep';

export type ExpansionStageErrorCode =
  | 'definition'
  | 'image'
  | 'metadata'
  | 'timeout'
  | 'server';

export type ExpansionStageStatus = StepState;

export type ExpansionStageSnapshot = {
  id: ExpansionStageId;
  status: ExpansionStageStatus;
  optional: boolean;
  summary?: string;
  error?: ExpansionStageErrorCode;
};

export type ExpansionPipelineStatus =
  | 'running'
  | 'completed'
  | 'partial'
  | 'failed';

/** Backend-facing pipeline snapshot consumed by the UI adapter. */
export type ExpansionPipelineSnapshot = {
  word: string;
  status: ExpansionPipelineStatus;
  stages: ExpansionStageSnapshot[];
};

export type ExpansionProgressItem = {
  id: ExpansionStageId;
  title: string;
  description?: string;
  state: ExpansionStageStatus;
  action?: React.ReactNode;
};
