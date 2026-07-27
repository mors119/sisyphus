import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { runExpansionPipeline } from './expansion.service';

describe('expansion.service', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('progresses through all stages in order', async () => {
    const snapshots: string[] = [];

    const promise = runExpansionPipeline('hello', {
      failStages: [],
      onUpdate: (snapshot) => {
        snapshots.push(
          snapshot.stages
            .map((stage) => `${stage.id}:${stage.status}`)
            .join('|'),
        );
      },
    });

    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result.status).toBe('completed');
    expect(result.stages.every((stage) => stage.status === 'completed')).toBe(
      true,
    );
    expect(snapshots[snapshots.length - 1]).toContain('persist-prep:completed');
  });

  it('stops required stages on failure while preserving completed summaries', async () => {
    const promise = runExpansionPipeline('hello', {
      failStages: ['definition'],
      onUpdate: () => undefined,
    });

    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result.status).toBe('failed');
    expect(result.stages.find((stage) => stage.id === 'verify-word')?.summary)
      .toBeTruthy();
    expect(result.stages.find((stage) => stage.id === 'definition')?.status).toBe(
      'failed',
    );
    expect(result.stages.find((stage) => stage.id === 'image')?.status).toBe(
      'pending',
    );
  });

  it('pauses on optional image failure so the user can continue or retry', async () => {
    const promise = runExpansionPipeline('hello', {
      failStages: ['image'],
      onUpdate: () => undefined,
    });

    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result.stages.find((stage) => stage.id === 'image')?.status).toBe(
      'failed',
    );
    expect(result.stages.find((stage) => stage.id === 'metadata')?.status).toBe(
      'pending',
    );
    expect(result.status).toBe('running');
  });
});
