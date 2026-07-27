import { describe, expect, it } from 'vitest';

import {
  createInitialPipeline,
  mapPipelineToProgressItems,
  mergeStageSnapshot,
  resolvePipelineStatus,
} from './expansion.adapter';

const t = ((key: string) => key) as never;

describe('expansion.adapter', () => {
  it('creates all five pipeline stages as pending', () => {
    const pipeline = createInitialPipeline('hello');

    expect(pipeline.stages).toHaveLength(5);
    expect(pipeline.stages.map((stage) => stage.id)).toEqual([
      'verify-word',
      'definition',
      'image',
      'metadata',
      'persist-prep',
    ]);
    expect(pipeline.stages.every((stage) => stage.status === 'pending')).toBe(
      true,
    );
  });

  it('marks required failure as failed and optional failure as partial when continued', () => {
    let pipeline = createInitialPipeline('hello');
    pipeline = mergeStageSnapshot(pipeline, {
      id: 'verify-word',
      status: 'completed',
      optional: false,
      summary: 'ok',
    });
    pipeline = mergeStageSnapshot(pipeline, {
      id: 'definition',
      status: 'completed',
      optional: false,
      summary: 'ok',
    });
    pipeline = mergeStageSnapshot(pipeline, {
      id: 'image',
      status: 'failed',
      optional: true,
      error: 'image',
    });

    expect(resolvePipelineStatus(pipeline.stages)).toBe('running');

    pipeline = mergeStageSnapshot(pipeline, {
      id: 'metadata',
      status: 'completed',
      optional: true,
      summary: 'ok',
    });
    pipeline = mergeStageSnapshot(pipeline, {
      id: 'persist-prep',
      status: 'completed',
      optional: false,
      summary: 'ok',
    });

    expect(resolvePipelineStatus(pipeline.stages)).toBe('partial');
  });

  it('maps completed summaries and retry actions without losing prior results', () => {
    let pipeline = createInitialPipeline('hello');
    pipeline = mergeStageSnapshot(pipeline, {
      id: 'verify-word',
      status: 'completed',
      optional: false,
      summary: 'verified',
    });
    pipeline = mergeStageSnapshot(pipeline, {
      id: 'image',
      status: 'failed',
      optional: true,
      error: 'image',
    });

    const items = mapPipelineToProgressItems(pipeline, t);

    expect(items[0]?.description).toBe('verified');
    expect(items[2]?.actions).toEqual({ retry: true, continue: true });
  });
});
