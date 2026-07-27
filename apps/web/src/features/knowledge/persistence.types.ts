export type PersistencePhase = 'idle' | 'saving' | 'success' | 'error';

export type CreatedKnowledgeNote = {
  id: number;
  title: string;
  subTitle?: string;
  description?: string;
};
