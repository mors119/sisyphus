import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createInitialPipeline, mergeStageSnapshot } from './expansion.adapter';
import { useExpansionPipeline } from './useExpansionPipeline.hook';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const startExpansionPipeline = vi.fn();
const retryExpansionStage = vi.fn();

vi.mock('./expansion.api', () => ({
  startExpansionPipeline: (...args: unknown[]) => startExpansionPipeline(...args),
  retryExpansionStage: (...args: unknown[]) => retryExpansionStage(...args),
}));

describe('useExpansionPipeline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts the pipeline when enabled', async () => {
    let pipeline = createInitialPipeline('hello');
    pipeline = mergeStageSnapshot(pipeline, {
      id: 'verify-word',
      status: 'completed',
      optional: false,
      summary: 'verified',
    });

    startExpansionPipeline.mockImplementation(async (_word, { onUpdate }) => {
      onUpdate(pipeline);
      return pipeline;
    });

    const { result } = renderHook(() => useExpansionPipeline('hello', true));

    await act(async () => {
      await Promise.resolve();
    });

    expect(startExpansionPipeline).toHaveBeenCalledWith(
      'hello',
      expect.objectContaining({ onUpdate: expect.any(Function) }),
    );
    expect(result.current.progressItems).toHaveLength(5);
    expect(
      result.current.progressItems.find((item) => item.id === 'verify-word')
        ?.description,
    ).toBe('verified');
  });

  it('surfaces retry and continue actions for failed optional stages', async () => {
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

    startExpansionPipeline.mockImplementation(async (_word, { onUpdate }) => {
      onUpdate(pipeline);
      return pipeline;
    });

    const { result } = renderHook(() => useExpansionPipeline('hello', true));

    await act(async () => {
      await Promise.resolve();
    });

    const imageItem = result.current.progressItems.find(
      (item) => item.id === 'image',
    );

    expect(imageItem?.actions).toEqual({ retry: true, continue: true });
    expect(
      result.current.progressItems.find((item) => item.id === 'verify-word')
        ?.description,
    ).toBe('verified');
  });

  it('retries an individual failed stage', async () => {
    let pipeline = createInitialPipeline('hello');
    pipeline = mergeStageSnapshot(pipeline, {
      id: 'image',
      status: 'failed',
      optional: true,
      error: 'image',
    });

    startExpansionPipeline.mockImplementation(async (_word, { onUpdate }) => {
      onUpdate(pipeline);
      return pipeline;
    });
    retryExpansionStage.mockResolvedValue(
      mergeStageSnapshot(pipeline, {
        id: 'image',
        status: 'completed',
        optional: true,
        summary: 'image found',
      }),
    );

    const { result } = renderHook(() => useExpansionPipeline('hello', true));

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await result.current.retryStage('image');
    });

    expect(retryExpansionStage).toHaveBeenCalledWith(
      'hello',
      'image',
      [],
      expect.objectContaining({ failStages: [] }),
    );
  });
});
