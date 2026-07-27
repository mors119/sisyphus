import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useWordInput } from './useWordInput.hook';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const submitWordForExpansion = vi.fn();

vi.mock('./word.api', () => ({
  submitWordForExpansion: (...args: unknown[]) => submitWordForExpansion(...args),
}));

describe('useWordInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    submitWordForExpansion.mockResolvedValue(undefined);
  });

  it('starts in idle state', () => {
    const { result } = renderHook(() => useWordInput());

    expect(result.current.phase).toBe('idle');
    expect(result.current.word).toBe('');
    expect(result.current.isSubmitting).toBe(false);
  });

  it('shows a field error for empty input and preserves typed text', async () => {
    const { result } = renderHook(() => useWordInput());

    act(() => {
      result.current.setWord('   ');
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.phase).toBe('failed');
    expect(result.current.fieldError).toBe('knowledge.input.errors.empty');
    expect(result.current.word).toBe('   ');
  });

  it('transitions to expanding after a successful submission', async () => {
    const { result } = renderHook(() => useWordInput());

    act(() => {
      result.current.setWord('hello');
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(submitWordForExpansion).toHaveBeenCalledWith('hello');
    expect(result.current.phase).toBe('expanding');
  });

  it('blocks duplicate submissions while validating', async () => {
    let resolveSubmit: (() => void) | undefined;
    submitWordForExpansion.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    const { result } = renderHook(() => useWordInput());

    act(() => {
      result.current.setWord('hello');
    });

    let firstSubmit: Promise<void> | undefined;
    act(() => {
      firstSubmit = result.current.submit();
      void result.current.submit();
    });

    expect(result.current.isSubmitting).toBe(true);

    await act(async () => {
      resolveSubmit?.();
      await firstSubmit;
    });

    expect(submitWordForExpansion).toHaveBeenCalledTimes(1);
  });

  it('preserves the word and surfaces duplicate failures', async () => {
    const { WordInputError } = await import('./word.types');
    submitWordForExpansion.mockRejectedValue(new WordInputError('duplicate'));

    const { result } = renderHook(() => useWordInput());

    act(() => {
      result.current.setWord('hello');
    });

    await act(async () => {
      await result.current.submit();
    });

    await waitFor(() => {
      expect(result.current.phase).toBe('failed');
    });

    expect(result.current.pageError).toBe('duplicate');
    expect(result.current.word).toBe('hello');
  });

  it('enters completion with the created note without resetting review edits early', () => {
    const { result } = renderHook(() => useWordInput());

    act(() => {
      result.current.setWord('hello');
      result.current.enterCompletion({ id: 7, title: 'hello' });
    });

    expect(result.current.phase).toBe('completed');
    expect(result.current.createdNote).toEqual({ id: 7, title: 'hello' });
    expect(result.current.word).not.toBe('');
  });

  it('resets the workspace only after an explicit reset action', () => {
    const { result } = renderHook(() => useWordInput());

    act(() => {
      result.current.setWord('hello');
      result.current.enterCompletion({ id: 7, title: 'hello' });
      result.current.reset();
    });

    expect(result.current.phase).toBe('idle');
    expect(result.current.word).toBe('');
    expect(result.current.createdNote).toBeNull();
  });
});
