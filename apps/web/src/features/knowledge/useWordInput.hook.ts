import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { submitWordForExpansion } from './word.api';
import { parseWordInput } from './wordInput.schema';
import { CreatedKnowledgeNote } from './persistence.types';
import {
  WordInputError,
  WordInputErrorCode,
  WordInputPhase,
  WordInputWorkspace,
} from './word.types';

export function useWordInput(): WordInputWorkspace {
  const { t } = useTranslation();
  const [word, setWord] = useState('');
  const [phase, setPhase] = useState<WordInputPhase>('idle');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<WordInputErrorCode | null>(null);
  const [createdNote, setCreatedNote] = useState<CreatedKnowledgeNote | null>(
    null,
  );
  const inFlightRef = useRef(false);

  const submit = useCallback(async () => {
    if (
      inFlightRef.current ||
      phase === 'validating' ||
      phase === 'expanding' ||
      phase === 'reviewing' ||
      phase === 'completed'
    ) {
      return;
    }

    inFlightRef.current = true;
    setFieldError(null);
    setPageError(null);
    setPhase('validating');

    const parsed = parseWordInput(word);

    if (!parsed.success) {
      setFieldError(t(`knowledge.input.errors.${parsed.code}`));
      setPhase('failed');
      inFlightRef.current = false;
      return;
    }

    const normalizedWord = parsed.word;
    setWord(normalizedWord);

    try {
      await submitWordForExpansion(normalizedWord);
      setPhase('expanding');
    } catch (error) {
      if (error instanceof WordInputError) {
        setPageError(error.code);
      } else {
        setPageError('request');
      }
      setPhase('failed');
    } finally {
      inFlightRef.current = false;
    }
  }, [phase, t, word]);

  const retry = useCallback(async () => {
    await submit();
  }, [submit]);

  const enterReview = useCallback(() => {
    setPhase('reviewing');
  }, []);

  const enterCompletion = useCallback((note: CreatedKnowledgeNote) => {
    setCreatedNote(note);
    setPhase('completed');
  }, []);

  const reset = useCallback(() => {
    setWord('');
    setPhase('idle');
    setFieldError(null);
    setPageError(null);
    setCreatedNote(null);
  }, []);

  const isSubmitting = phase === 'validating';

  return {
    word,
    setWord,
    phase,
    fieldError,
    pageError,
    isSubmitting,
    submit,
    retry,
    enterReview,
    enterCompletion,
    reset,
    createdNote,
  };
}
