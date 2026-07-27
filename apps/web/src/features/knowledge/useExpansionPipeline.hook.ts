import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getAnnouncementMessage,
  getCompletedSummaries,
  mapPipelineToProgressItems,
  skipOptionalStage,
  StageActionDescriptor,
} from './expansion.adapter';
import { EXPANSION_STAGE_ORDER } from './expansion.constants';
import { retryExpansionStage, startExpansionPipeline } from './expansion.api';
import {
  ExpansionPipelineSnapshot,
  ExpansionStageId,
} from './expansion.types';

export type ExpansionProgressListItem = {
  id: ExpansionStageId;
  title: string;
  description?: string;
  state: ExpansionPipelineSnapshot['stages'][number]['status'];
  actions?: StageActionDescriptor;
};

export function useExpansionPipeline(word: string, enabled: boolean) {
  const { t } = useTranslation();
  const [pipeline, setPipeline] = useState<ExpansionPipelineSnapshot | null>(
    null,
  );
  const abortRef = useRef<AbortController | null>(null);

  const runPipeline = useCallback(
    async (
      runner: (
        onUpdate: (snapshot: ExpansionPipelineSnapshot) => void,
        signal: AbortSignal,
      ) => Promise<ExpansionPipelineSnapshot>,
    ) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      await runner((snapshot) => {
        setPipeline(snapshot);
      }, controller.signal);
    },
    [],
  );

  useEffect(() => {
    if (!enabled || !word) return;

    void runPipeline((onUpdate, signal) =>
      startExpansionPipeline(word, { onUpdate, signal }),
    );

    return () => {
      abortRef.current?.abort();
    };
  }, [enabled, runPipeline, word]);

  const retryStage = useCallback(
    async (stageId: ExpansionStageId) => {
      if (!pipeline) return;

      const preserved = pipeline.stages.filter(
        (stage) => stage.status === 'completed',
      );

      await runPipeline((onUpdate, signal) =>
        retryExpansionStage(word, stageId, preserved, {
          onUpdate,
          signal,
          failStages: [],
        }),
      );
    },
    [pipeline, runPipeline, word],
  );

  const continueAfterFailure = useCallback(
    async (stageId: ExpansionStageId) => {
      if (!pipeline) return;

      const skipped = skipOptionalStage(pipeline, stageId);
      setPipeline(skipped);

      const preserved = skipped.stages.filter(
        (stage) =>
          stage.status === 'completed' || stage.status === 'skipped',
      );

      const nextStageId =
        EXPANSION_STAGE_ORDER[
          EXPANSION_STAGE_ORDER.indexOf(stageId) + 1
        ];

      if (!nextStageId) {
        setPipeline({
          ...skipped,
          status: resolveSkippedPipelineStatus(skipped),
        });
        return;
      }

      await runPipeline((onUpdate, signal) =>
        retryExpansionStage(word, nextStageId, preserved, {
          onUpdate,
          signal,
          failStages: [],
        }),
      );
    },
    [pipeline, runPipeline, word],
  );

  const progressItems = useMemo<ExpansionProgressListItem[]>(() => {
    if (!pipeline) return [];
    return mapPipelineToProgressItems(pipeline, t);
  }, [pipeline, t]);

  const announcement = pipeline ? getAnnouncementMessage(pipeline, t) : null;
  const completedSummaries = pipeline ? getCompletedSummaries(pipeline) : [];

  return {
    pipeline,
    progressItems,
    announcement,
    completedSummaries,
    retryStage,
    continueAfterFailure,
  };
}

function resolveSkippedPipelineStatus(
  pipeline: ExpansionPipelineSnapshot,
): ExpansionPipelineSnapshot['status'] {
  const requiredStages = pipeline.stages.filter((stage) => !stage.optional);
  const hasRequiredFailure = requiredStages.some(
    (stage) => stage.status === 'failed',
  );
  if (hasRequiredFailure) return 'failed';

  const allRequiredDone = requiredStages.every(
    (stage) => stage.status === 'completed' || stage.status === 'skipped',
  );
  const hasOptionalFailure = pipeline.stages.some(
    (stage) => stage.optional && stage.status === 'failed',
  );

  if (allRequiredDone && hasOptionalFailure) return 'partial';
  if (allRequiredDone) return 'completed';
  return 'running';
}
