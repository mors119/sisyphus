import {
  OPTIONAL_REVIEW_SECTIONS,
  REVIEW_SECTION_ORDER,
} from './review.constants';
import {
  GeneratedKnowledge,
  KnowledgePersistencePayload,
  KnowledgeReviewState,
  ReviewSectionId,
  ReviewSectionMeta,
} from './review.types';

export function buildGeneratedKnowledge(word: string): GeneratedKnowledge {
  return {
    word,
    pronunciation: `/${word}/`,
    definitions: `${word}의 주요 의미와 쓰임.`,
    imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(word)}`,
    exampleSentence: `${word}를 문맥에 맞게 사용하는 예문.`,
    tags: [{ id: Date.now(), name: word }],
    difficulty: 'intermediate',
  };
}

export function createReviewState(word: string): KnowledgeReviewState {
  const source = buildGeneratedKnowledge(word);
  const sections = Object.fromEntries(
    REVIEW_SECTION_ORDER.map((id) => [
      id,
      {
        id,
        optional: OPTIONAL_REVIEW_SECTIONS.has(id),
        state: 'generated',
        excluded: false,
      } satisfies ReviewSectionMeta,
    ]),
  ) as Record<ReviewSectionId, ReviewSectionMeta>;

  return {
    source,
    draft: structuredClone(source),
    sections,
  };
}

export function buildPersistencePayload(
  review: KnowledgeReviewState,
): KnowledgePersistencePayload {
  const { draft, sections } = review;

  const descriptionParts: string[] = [];

  if (!sections.definitions.excluded && draft.definitions.trim()) {
    descriptionParts.push(draft.definitions.trim());
  }

  if (!sections.example.excluded && draft.exampleSentence.trim()) {
    descriptionParts.push(draft.exampleSentence.trim());
  }

  if (!sections.difficulty.excluded && draft.difficulty.trim()) {
    descriptionParts.push(`Difficulty: ${draft.difficulty.trim()}`);
  }

  return {
    title: draft.word.trim(),
    subTitle: sections.pronunciation.excluded
      ? undefined
      : draft.pronunciation.trim() || undefined,
    description:
      descriptionParts.length > 0 ? descriptionParts.join('\n\n') : undefined,
    tags: sections.tags.excluded ? [] : draft.tags,
  };
}

export function getSectionValue(
  review: KnowledgeReviewState,
  sectionId: ReviewSectionId,
): string {
  const { draft, sections } = review;

  if (sections[sectionId].excluded) {
    return '';
  }

  switch (sectionId) {
    case 'word':
      return draft.word;
    case 'pronunciation':
      return draft.pronunciation;
    case 'definitions':
      return draft.definitions;
    case 'image':
      return draft.imageUrl ?? '';
    case 'example':
      return draft.exampleSentence;
    case 'tags':
      return draft.tags.map((tag) => tag.name).join(', ');
    case 'difficulty':
      return draft.difficulty;
  }
}

export function formatTagsDisplay(tags: GeneratedKnowledge['tags']): string {
  return tags.map((tag) => `#${tag.name}`).join(' ');
}
