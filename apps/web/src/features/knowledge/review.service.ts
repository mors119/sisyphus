import {
  GeneratedKnowledge,
  ReviewSectionId,
} from './review.types';

const REGENERATE_DELAY_MS = 250;

/**
 * Simulates per-section regeneration until the Word Expansion API exposes
 * section-scoped regen endpoints. Returns placeholder content matching the
 * `GeneratedKnowledge` shape consumed by the review adapter.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function regenerateReviewSection(
  word: string,
  sectionId: ReviewSectionId,
): Promise<Partial<GeneratedKnowledge>> {
  await delay(REGENERATE_DELAY_MS);

  switch (sectionId) {
    case 'word':
      return { word };
    case 'pronunciation':
      return { pronunciation: `/${word}-regen/` };
    case 'definitions':
      return {
        definitions: `${word}의 새로 생성된 정의입니다.`,
      };
    case 'image':
      return {
        imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(`${word}-new`)}`,
      };
    case 'example':
      return {
        exampleSentence: `${word}를 다시 생성한 예문입니다.`,
      };
    case 'tags':
      return {
        tags: [
          { id: Date.now(), name: word },
          { id: Date.now() + 1, name: `${word}-tag` },
        ],
      };
    case 'difficulty':
      return { difficulty: 'advanced' };
  }
}
