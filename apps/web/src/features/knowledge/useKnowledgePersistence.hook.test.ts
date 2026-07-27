import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useKnowledgePersistence } from './useKnowledgePersistence.hook';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mutateAsync = vi.fn();
const invalidateQuery = vi.fn();

vi.mock('../view/useView.mutation', () => ({
  useCreateNoteMutation: () => ({
    mutateAsync,
    isPending: false,
  }),
}));

vi.mock('@/lib/react-query', () => ({
  invalidateQuery: (...args: unknown[]) => invalidateQuery(...args),
}));

describe('useKnowledgePersistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mutateAsync.mockResolvedValue(42);
    invalidateQuery.mockResolvedValue(undefined);
  });

  it('enters saving state while persistence is in flight', async () => {
    let resolveSave: ((value: number) => void) | undefined;
    mutateAsync.mockImplementation(
      () =>
        new Promise<number>((resolve) => {
          resolveSave = resolve;
        }),
    );

    const { result } = renderHook(() => useKnowledgePersistence());

    let savePromise: Promise<unknown> | undefined;
    act(() => {
      savePromise = result.current.save({
        title: 'hello',
        tags: [],
      });
    });

    expect(result.current.isSaving).toBe(true);
    expect(result.current.phase).toBe('saving');

    await act(async () => {
      resolveSave?.(42);
      await savePromise;
    });

    expect(result.current.phase).toBe('success');
  });

  it('prevents duplicate save requests', async () => {
    let resolveSave: ((value: number) => void) | undefined;
    mutateAsync.mockImplementation(
      () =>
        new Promise<number>((resolve) => {
          resolveSave = resolve;
        }),
    );

    const { result } = renderHook(() => useKnowledgePersistence());
    const payload = { title: 'hello', tags: [] };

    let firstSave: Promise<unknown> | undefined;
    act(() => {
      firstSave = result.current.save(payload);
      void result.current.save(payload);
    });

    await act(async () => {
      resolveSave?.(42);
      await firstSave;
    });

    expect(mutateAsync).toHaveBeenCalledTimes(1);
  });

  it('preserves review edits by surfacing a page error instead of resetting', async () => {
    mutateAsync.mockRejectedValue(new Error('save failed'));

    const { result } = renderHook(() => useKnowledgePersistence());

    await act(async () => {
      await result.current.save({ title: 'hello', tags: [] });
    });

    await waitFor(() => {
      expect(result.current.phase).toBe('error');
    });

    expect(result.current.errorMessage).toBe(
      'knowledge.completion.errors.saveFailed',
    );
    expect(result.current.createdNote).toBeNull();
  });

  it('returns the created note after a successful save', async () => {
    const { result } = renderHook(() => useKnowledgePersistence());

    let savedNote: unknown;
    await act(async () => {
      savedNote = await result.current.save({
        title: 'hello',
        subTitle: '/həˈloʊ/',
        description: 'A greeting.',
        tags: [],
      });
    });

    expect(savedNote).toEqual({
      id: 42,
      title: 'hello',
      subTitle: '/həˈloʊ/',
      description: 'A greeting.',
    });
    expect(invalidateQuery).toHaveBeenCalledWith(['notes']);
  });
});
