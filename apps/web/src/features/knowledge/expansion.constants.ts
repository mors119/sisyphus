import { ExpansionStageId } from './expansion.types';

export const EXPANSION_STAGE_ORDER: ExpansionStageId[] = [
  'verify-word',
  'definition',
  'image',
  'metadata',
  'persist-prep',
];

export const OPTIONAL_EXPANSION_STAGES = new Set<ExpansionStageId>([
  'image',
  'metadata',
]);

export const EXPANSION_STAGE_I18N_KEY: Record<ExpansionStageId, string> = {
  'verify-word': 'knowledge.expansion.stages.verifyWord',
  definition: 'knowledge.expansion.stages.definition',
  image: 'knowledge.expansion.stages.image',
  metadata: 'knowledge.expansion.stages.metadata',
  'persist-prep': 'knowledge.expansion.stages.persistPrep',
};
