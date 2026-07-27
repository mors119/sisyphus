import { TagTemp } from '../tag/tag.type';

export type ReviewSectionId =
  | 'word'
  | 'pronunciation'
  | 'definitions'
  | 'image'
  | 'example'
  | 'tags'
  | 'difficulty';

export type ReviewSectionState =
  | 'generated'
  | 'edited'
  | 'excluded'
  | 'failed'
  | 'regenerating';

export type GeneratedKnowledge = {
  word: string;
  pronunciation: string;
  definitions: string;
  imageUrl: string | null;
  exampleSentence: string;
  tags: TagTemp[];
  difficulty: string;
};

export type ReviewSectionMeta = {
  id: ReviewSectionId;
  optional: boolean;
  state: ReviewSectionState;
  excluded: boolean;
  error?: string;
};

export type KnowledgeReviewState = {
  source: GeneratedKnowledge;
  draft: GeneratedKnowledge;
  sections: Record<ReviewSectionId, ReviewSectionMeta>;
};

export type KnowledgePersistencePayload = {
  title: string;
  subTitle?: string;
  description?: string;
  tags: TagTemp[];
  imageId?: number;
};
