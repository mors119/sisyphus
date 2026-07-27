import { describe, expect, it } from 'vitest';

import {
  buildGeneratedKnowledge,
  buildPersistencePayload,
  createReviewState,
} from './review.adapter';

describe('review.adapter', () => {
  it('builds a persistence payload from reviewed draft values', () => {
    const review = createReviewState('hello');
    review.draft.pronunciation = '/həˈloʊ/';
    review.draft.definitions = 'edited definition';
    review.sections.pronunciation.state = 'edited';

    const payload = buildPersistencePayload(review);

    expect(payload.title).toBe('hello');
    expect(payload.subTitle).toBe('/həˈloʊ/');
    expect(payload.description).toContain('edited definition');
  });

  it('omits optional excluded sections from the persistence payload', () => {
    const review = createReviewState('hello');
    review.sections.image.excluded = true;
    review.sections.image.state = 'excluded';
    review.sections.tags.excluded = true;
    review.sections.tags.state = 'excluded';
    review.sections.difficulty.excluded = true;
    review.sections.difficulty.state = 'excluded';

    const payload = buildPersistencePayload(review);

    expect(payload.tags).toEqual([]);
    expect(payload.description).not.toContain('Difficulty');
  });

  it('creates generated knowledge with all review sections', () => {
    const generated = buildGeneratedKnowledge('focus');

    expect(generated.word).toBe('focus');
    expect(generated.definitions).toBeTruthy();
    expect(generated.exampleSentence).toBeTruthy();
    expect(generated.tags.length).toBeGreaterThan(0);
  });
});
