import { TFunction } from 'i18next';

import {
  EXPANSION_STAGE_I18N_KEY,
  EXPANSION_STAGE_ORDER,
  OPTIONAL_EXPANSION_STAGES,
} from './expansion.constants';
import {
  ExpansionPipelineSnapshot,
  ExpansionProgressItem,
  ExpansionStageId,
  ExpansionStageSnapshot,
} from './expansion.types';

export type StageActionDescriptor = {
  retry?: boolean;
  continue?: boolean;
};

export function createInitialPipeline(word: string): ExpansionPipelineSnapshot {
  return {
    word,
    status: 'running',
    stages: EXPANSION_STAGE_ORDER.map((id) => ({
      id,
      status: 'pending',
      optional: OPTIONAL_EXPANSION_STAGES.has(id),
    })),
  };
}

export function resolvePipelineStatus(
  stages: ExpansionStageSnapshot[],
): ExpansionPipelineSnapshot['status'] {
  const requiredStages = stages.filter((stage) => !stage.optional);
  const hasRequiredFailure = requiredStages.some((stage) => stage.status === 'failed');
  const hasOptionalFailure = stages.some(
    (stage) => stage.optional && stage.status === 'failed',
  );
  const allRequiredDone = requiredStages.every(
    (stage) => stage.status === 'completed' || stage.status === 'skipped',
  );
  const hasActive = stages.some((stage) => stage.status === 'active');

  if (hasActive) return 'running';
  if (hasRequiredFailure) return 'failed';
  if (allRequiredDone && hasOptionalFailure) return 'partial';
  if (allRequiredDone) return 'completed';
  return 'running';
}

export function mergeStageSnapshot(
  pipeline: ExpansionPipelineSnapshot,
  nextStage: ExpansionStageSnapshot,
): ExpansionPipelineSnapshot {
  const stages = pipeline.stages.map((stage) =>
    stage.id === nextStage.id ? { ...stage, ...nextStage } : stage,
  );

  return {
    ...pipeline,
    stages,
    status: resolvePipelineStatus(stages),
  };
}

export function skipOptionalStage(
  pipeline: ExpansionPipelineSnapshot,
  stageId: ExpansionStageId,
): ExpansionPipelineSnapshot {
  const stages = pipeline.stages.map((stage) =>
    stage.id === stageId && stage.optional
      ? { ...stage, status: 'skipped' as const, error: undefined }
      : stage,
  );

  return {
    ...pipeline,
    stages,
    status: resolvePipelineStatus(stages),
  };
}

export function mapPipelineToProgressItems(
  pipeline: ExpansionPipelineSnapshot,
  t: TFunction,
): Array<ExpansionProgressItem & { actions?: StageActionDescriptor }> {
  return pipeline.stages.map((stage) => ({
    id: stage.id,
    title: t(EXPANSION_STAGE_I18N_KEY[stage.id]),
    description: describeStage(stage, t),
    state: stage.status,
    actions:
      stage.status === 'failed'
        ? {
            retry: true,
            continue: stage.optional,
          }
        : undefined,
  }));
}

function describeStage(
  stage: ExpansionStageSnapshot,
  t: TFunction,
): string | undefined {
  if (stage.status === 'completed' && stage.summary) {
    return stage.summary;
  }

  if (stage.status === 'failed' && stage.error) {
    return t(`knowledge.expansion.errors.${stage.error}`);
  }

  if (stage.status === 'skipped') {
    return t('knowledge.expansion.status.skipped');
  }

  return undefined;
}

export function getActiveStage(
  pipeline: ExpansionPipelineSnapshot,
): ExpansionStageSnapshot | undefined {
  return pipeline.stages.find((stage) => stage.status === 'active');
}

export function getAnnouncementMessage(
  pipeline: ExpansionPipelineSnapshot,
  t: TFunction,
): string | null {
  const active = getActiveStage(pipeline);
  if (active) {
    return t('knowledge.expansion.announcements.active', {
      stage: t(EXPANSION_STAGE_I18N_KEY[active.id]),
    });
  }

  if (pipeline.status === 'completed') {
    return t('knowledge.expansion.announcements.completed');
  }

  if (pipeline.status === 'partial') {
    return t('knowledge.expansion.announcements.partial');
  }

  if (pipeline.status === 'failed') {
    return t('knowledge.expansion.announcements.failed');
  }

  return null;
}
