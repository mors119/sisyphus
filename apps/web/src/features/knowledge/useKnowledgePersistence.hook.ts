import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { invalidateQuery } from '@/lib/react-query';
import { useCreateNoteMutation } from '../view/useView.mutation';

import {
  CreatedKnowledgeNote,
  PersistencePhase,
} from './persistence.types';
import { KnowledgePersistencePayload } from './review.types';

export function useKnowledgePersistence() {
  const { t } = useTranslation();
  const createMutation = useCreateNoteMutation();
  const inFlightRef = useRef(false);
  const [phase, setPhase] = useState<PersistencePhase>('idle');
  const [createdNote, setCreatedNote] = useState<CreatedKnowledgeNote | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const save = useCallback(
    async (
      payload: KnowledgePersistencePayload,
    ): Promise<CreatedKnowledgeNote | null> => {
      if (
        inFlightRef.current ||
        phase === 'saving' ||
        createMutation.isPending
      ) {
        return null;
      }

      if (!payload.title.trim()) {
        return null;
      }

      inFlightRef.current = true;
      setPhase('saving');
      setErrorMessage(null);

      try {
        const noteId = await createMutation.mutateAsync({
          title: payload.title,
          subTitle: payload.subTitle,
          description: payload.description,
          tags: payload.tags,
          categoryId: undefined,
          imageId: payload.imageId,
        });
        await invalidateQuery(['notes']);

        const note: CreatedKnowledgeNote = {
          id: noteId,
          title: payload.title,
          subTitle: payload.subTitle,
          description: payload.description,
        };
        setCreatedNote(note);
        setPhase('success');
        return note;
      } catch {
        setPhase('error');
        setErrorMessage(t('knowledge.completion.errors.saveFailed'));
        return null;
      } finally {
        inFlightRef.current = false;
      }
    },
    [createMutation, phase, t],
  );

  const reset = useCallback(() => {
    setPhase('idle');
    setCreatedNote(null);
    setErrorMessage(null);
  }, []);

  return {
    phase,
    createdNote,
    errorMessage,
    isSaving: phase === 'saving',
    save,
    reset,
  };
}
