import {
  EXPANSION_STAGE_ORDER,
  OPTIONAL_EXPANSION_STAGES,
} from './expansion.constants';
import {
  createInitialPipeline,
  mergeStageSnapshot,
  resolvePipelineStatus,
} from './expansion.adapter';
import {
  ExpansionPipelineSnapshot,
  ExpansionStageErrorCode,
  ExpansionStageId,
  ExpansionStageSnapshot,
} from './expansion.types';

const STAGE_DELAY_MS = 350;

export type RunExpansionOptions = {
  failStages?: ExpansionStageId[];
  signal?: AbortSignal;
  startFrom?: ExpansionStageId;
  preserve?: ExpansionStageSnapshot[];
  onUpdate: (snapshot: ExpansionPipelineSnapshot) => void;
};

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true },
    );
  });
}

function resolveStageError(
  stageId: ExpansionStageId,
  failStages: Set<ExpansionStageId>,
): ExpansionStageErrorCode {
  if (failStages.has(stageId)) {
    if (stageId === 'definition') return 'definition';
    if (stageId === 'image') return 'image';
    if (stageId === 'metadata') return 'metadata';
    if (stageId === 'persist-prep') return 'server';
  }

  return 'server';
}

function buildStageSummary(
  stageId: ExpansionStageId,
  word: string,
): string | undefined {
  switch (stageId) {
    case 'verify-word':
      return `"${word}" 확인 완료`;
    case 'definition':
      return '정의 2개 생성됨';
    case 'image':
      return '관련 이미지 1개 선택됨';
    case 'metadata':
      return '태그 및 분류 정보 구성됨';
    case 'persist-prep':
      return '저장 형식 준비 완료';
    default:
      return undefined;
  }
}

async function runStage(
  stageId: ExpansionStageId,
  word: string,
  failStages: Set<ExpansionStageId>,
  signal?: AbortSignal,
): Promise<ExpansionStageSnapshot> {
  await delay(STAGE_DELAY_MS, signal);

  const optional = OPTIONAL_EXPANSION_STAGES.has(stageId);

  if (failStages.has(stageId)) {
    const error =
      stageId === 'metadata' && word.toLowerCase().includes('fail-timeout')
        ? 'timeout'
        : resolveStageError(stageId, failStages);

    return {
      id: stageId,
      status: 'failed',
      optional,
      error,
    };
  }

  return {
    id: stageId,
    status: 'completed',
    optional,
    summary: buildStageSummary(stageId, word),
  };
}

function applyPreservedStages(
  pipeline: ExpansionPipelineSnapshot,
  preserve: ExpansionStageSnapshot[],
): ExpansionPipelineSnapshot {
  return preserve.reduce(
    (current, stage) => mergeStageSnapshot(current, stage),
    pipeline,
  );
}

function nextRunnableStage(
  pipeline: ExpansionPipelineSnapshot,
  startFrom?: ExpansionStageId,
): ExpansionStageId | undefined {
  const startIndex = startFrom
    ? EXPANSION_STAGE_ORDER.indexOf(startFrom)
    : 0;

  if (startIndex < 0) return undefined;

  for (const stageId of EXPANSION_STAGE_ORDER.slice(startIndex)) {
    const stage = pipeline.stages.find((item) => item.id === stageId);
    if (!stage) continue;
    if (stage.status === 'completed' || stage.status === 'skipped') continue;
    if (stage.status === 'failed') {
      if (stage.optional) continue;
      return undefined;
    }
    return stageId;
  }

  return undefined;
}

/**
 * Simulates backend stage snapshots until the Word Expansion API is available.
 * The callback receives the same snapshot shape the UI adapter consumes.
 */
export async function runExpansionPipeline(
  word: string,
  options: RunExpansionOptions,
): Promise<ExpansionPipelineSnapshot> {
  const failStages = new Set(options.failStages ?? []);
  let pipeline = createInitialPipeline(word);

  if (options.preserve?.length) {
    pipeline = applyPreservedStages(pipeline, options.preserve);
  }

  options.onUpdate(pipeline);

  let stageId = nextRunnableStage(pipeline, options.startFrom);

  while (stageId) {
    pipeline = mergeStageSnapshot(pipeline, {
      ...(pipeline.stages.find((stage) => stage.id === stageId) as ExpansionStageSnapshot),
      status: 'active',
    });
    options.onUpdate(pipeline);

    const result = await runStage(stageId, word, failStages, options.signal);
    pipeline = mergeStageSnapshot(pipeline, result);
    options.onUpdate(pipeline);

    if (result.status === 'failed') {
      break;
    }

    stageId = nextRunnableStage(pipeline);
  }

  pipeline = {
    ...pipeline,
    status: resolvePipelineStatus(pipeline.stages),
  };
  options.onUpdate(pipeline);

  return pipeline;
}

export function inferFailStagesFromWord(word: string): ExpansionStageId[] {
  const normalized = word.toLowerCase();

  if (normalized.includes('fail-all')) {
    return ['definition'];
  }
  if (normalized.includes('fail-image')) {
    return ['image'];
  }
  if (normalized.includes('fail-definition')) {
    return ['definition'];
  }
  if (normalized.includes('fail-metadata')) {
    return ['metadata'];
  }
  if (normalized.includes('fail-timeout')) {
    return ['metadata'];
  }
  if (normalized.includes('fail-server')) {
    return ['persist-prep'];
  }

  return [];
}
