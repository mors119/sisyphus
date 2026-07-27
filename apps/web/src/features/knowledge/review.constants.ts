import {
  ReviewSectionId,
  ReviewSectionState,
} from './review.types';

export const REVIEW_SECTION_ORDER: ReviewSectionId[] = [
  'word',
  'pronunciation',
  'definitions',
  'image',
  'example',
  'tags',
  'difficulty',
];

export const OPTIONAL_REVIEW_SECTIONS = new Set<ReviewSectionId>([
  'pronunciation',
  'image',
  'example',
  'tags',
  'difficulty',
]);

export const REVIEW_SECTION_I18N_KEY: Record<ReviewSectionId, string> = {
  word: 'knowledge.review.sections.word',
  pronunciation: 'knowledge.review.sections.pronunciation',
  definitions: 'knowledge.review.sections.definitions',
  image: 'knowledge.review.sections.image',
  example: 'knowledge.review.sections.example',
  tags: 'knowledge.review.sections.tags',
  difficulty: 'knowledge.review.sections.difficulty',
};

export const REVIEW_STATUS_I18N_KEY: Record<
  ReviewSectionState,
  string
> = {
  generated: 'knowledge.review.status.generated',
  edited: 'knowledge.review.status.edited',
  excluded: 'knowledge.review.status.excluded',
  failed: 'knowledge.review.status.failed',
  regenerating: 'knowledge.review.status.regenerating',
};
