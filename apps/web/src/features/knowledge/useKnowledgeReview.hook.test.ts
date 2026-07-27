import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useKnowledgeReview } from './useKnowledgeReview.hook';

const regenerateReviewSection = vi.fn();

vi.mock('./review.service', () => ({
  regenerateReviewSection: (...args: unknown[]) =>
    regenerateReviewSection(...args),
}));

describe('useKnowledgeReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    regenerateReviewSection.mockResolvedValue({
      definitions: 'regenerated definition',
    });
  });

  it('tracks manual edits separately from generated source data', () => {
    const { result } = renderHook(() => useKnowledgeReview('hello', true));

    act(() => {
      result.current.updateDraft('definitions', 'my edited definition');
    });

    expect(result.current.review?.draft.definitions).toBe('my edited definition');
    expect(result.current.review?.source.definitions).not.toBe(
      'my edited definition',
    );
    expect(result.current.review?.sections.definitions.state).toBe('edited');
  });

  it('preserves unrelated edits when regenerating another section', async () => {
    const { result } = renderHook(() => useKnowledgeReview('hello', true));

    act(() => {
      result.current.updateDraft('example', 'kept example edit');
    });

    await act(async () => {
      await result.current.regenerateSection('definitions');
    });

    await waitFor(() => {
      expect(result.current.review?.sections.definitions.state).toBe('generated');
    });

    expect(result.current.review?.draft.exampleSentence).toBe('kept example edit');
    expect(result.current.review?.sections.example.state).toBe('edited');
    expect(result.current.review?.draft.definitions).toBe('regenerated definition');
  });

  it('excludes optional sections without blocking persistence payload', () => {
    const { result } = renderHook(() => useKnowledgeReview('hello', true));

    act(() => {
      result.current.excludeSection('pronunciation');
    });

    expect(result.current.review?.sections.pronunciation.excluded).toBe(true);
    expect(result.current.persistencePayload?.subTitle).toBeUndefined();
    expect(result.current.persistencePayload?.title).toBe('hello');
  });

  it('restores excluded sections back to generated source values', () => {
    const { result } = renderHook(() => useKnowledgeReview('hello', true));

    act(() => {
      result.current.updateDraft('pronunciation', '/edited/');
      result.current.excludeSection('pronunciation');
      result.current.restoreSection('pronunciation');
    });

    expect(result.current.review?.sections.pronunciation.excluded).toBe(false);
    expect(result.current.review?.draft.pronunciation).toBe(
      result.current.review?.source.pronunciation,
    );
  });
});
