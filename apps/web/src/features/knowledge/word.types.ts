import { CreatedKnowledgeNote } from './persistence.types';

export type WordInputPhase =
  | 'idle'
  | 'validating'
  | 'expanding'
  | 'reviewing'
  | 'completed'
  | 'failed';

export type WordInputErrorCode = 'empty' | 'invalid' | 'duplicate' | 'request';

export class WordInputError extends Error {
  constructor(public readonly code: WordInputErrorCode) {
    super(code);
    this.name = 'WordInputError';
  }
}

export type WordInputWorkspace = {
  word: string;
  setWord: (word: string) => void;
  phase: WordInputPhase;
  fieldError: string | null;
  pageError: WordInputErrorCode | null;
  isSubmitting: boolean;
  submit: () => Promise<void>;
  retry: () => Promise<void>;
  enterReview: () => void;
  enterCompletion: (note: CreatedKnowledgeNote) => void;
  reset: () => void;
  createdNote: CreatedKnowledgeNote | null;
};
