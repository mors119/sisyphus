import { useCallback, useMemo, useState } from 'react';

import { TagTemp } from '../tag/tag.type';
import {
  buildPersistencePayload,
  createReviewState,
} from './review.adapter';
import { regenerateReviewSection } from './review.service';
import {
  GeneratedKnowledge,
  KnowledgePersistencePayload,
  KnowledgeReviewState,
  ReviewSectionId,
} from './review.types';

export function useKnowledgeReview(word: string, enabled: boolean) {
  const [review, setReview] = useState<KnowledgeReviewState | null>(() =>
    enabled && word ? createReviewState(word) : null,
  );
  const [editingSection, setEditingSection] = useState<ReviewSectionId | null>(
    null,
  );

  const updateDraft = useCallback(
    (sectionId: ReviewSectionId, value: string | TagTemp[]) => {
      setReview((current) => {
        if (!current) return current;

        const nextDraft = { ...current.draft };
        switch (sectionId) {
          case 'word':
            nextDraft.word = String(value);
            break;
          case 'pronunciation':
            nextDraft.pronunciation = String(value);
            break;
          case 'definitions':
            nextDraft.definitions = String(value);
            break;
          case 'image':
            nextDraft.imageUrl = String(value) || null;
            break;
          case 'example':
            nextDraft.exampleSentence = String(value);
            break;
          case 'tags':
            nextDraft.tags = value as TagTemp[];
            break;
          case 'difficulty':
            nextDraft.difficulty = String(value);
            break;
        }

        return {
          ...current,
          draft: nextDraft,
          sections: {
            ...current.sections,
            [sectionId]: {
              ...current.sections[sectionId],
              state: 'edited',
              excluded: false,
            },
          },
        };
      });
    },
    [],
  );

  const startEdit = useCallback((sectionId: ReviewSectionId) => {
    setEditingSection(sectionId);
  }, []);

  const finishEdit = useCallback(() => {
    setEditingSection(null);
  }, []);

  const cancelEdit = useCallback((sectionId: ReviewSectionId) => {
    setReview((current) => {
      if (!current) return current;

      const nextDraft = { ...current.draft };
      switch (sectionId) {
        case 'word':
          nextDraft.word = current.source.word;
          break;
        case 'pronunciation':
          nextDraft.pronunciation = current.source.pronunciation;
          break;
        case 'definitions':
          nextDraft.definitions = current.source.definitions;
          break;
        case 'image':
          nextDraft.imageUrl = current.source.imageUrl;
          break;
        case 'example':
          nextDraft.exampleSentence = current.source.exampleSentence;
          break;
        case 'tags':
          nextDraft.tags = structuredClone(current.source.tags);
          break;
        case 'difficulty':
          nextDraft.difficulty = current.source.difficulty;
          break;
      }

      return {
        ...current,
        draft: nextDraft,
        sections: {
          ...current.sections,
          [sectionId]: {
            ...current.sections[sectionId],
            state: 'generated',
          },
        },
      };
    });
    setEditingSection((current) => (current === sectionId ? null : current));
  }, []);

  const excludeSection = useCallback((sectionId: ReviewSectionId) => {
    setReview((current) => {
      if (!current) return current;

      return {
        ...current,
        sections: {
          ...current.sections,
          [sectionId]: {
            ...current.sections[sectionId],
            excluded: true,
            state: 'excluded',
          },
        },
      };
    });
    setEditingSection((current) => (current === sectionId ? null : current));
  }, []);

  const restoreSection = useCallback((sectionId: ReviewSectionId) => {
    setReview((current) => {
      if (!current) return current;

      const nextDraft = { ...current.draft };
      const sourceValue = current.source;

      switch (sectionId) {
        case 'word':
          nextDraft.word = sourceValue.word;
          break;
        case 'pronunciation':
          nextDraft.pronunciation = sourceValue.pronunciation;
          break;
        case 'definitions':
          nextDraft.definitions = sourceValue.definitions;
          break;
        case 'image':
          nextDraft.imageUrl = sourceValue.imageUrl;
          break;
        case 'example':
          nextDraft.exampleSentence = sourceValue.exampleSentence;
          break;
        case 'tags':
          nextDraft.tags = structuredClone(sourceValue.tags);
          break;
        case 'difficulty':
          nextDraft.difficulty = sourceValue.difficulty;
          break;
      }

      return {
        ...current,
        draft: nextDraft,
        sections: {
          ...current.sections,
          [sectionId]: {
            ...current.sections[sectionId],
            excluded: false,
            state: 'generated',
            error: undefined,
          },
        },
      };
    });
  }, []);

  const regenerateSection = useCallback(
    async (sectionId: ReviewSectionId) => {
      let wasEdited = false;

      setReview((current) => {
        if (!current) return current;
        wasEdited = current.sections[sectionId].state === 'edited';

        return {
          ...current,
          sections: {
            ...current.sections,
            [sectionId]: {
              ...current.sections[sectionId],
              state: 'regenerating',
              error: undefined,
            },
          },
        };
      });

      try {
        const regenerated = await regenerateReviewSection(word, sectionId);

        setReview((current) => {
          if (!current) return current;

          const nextSource: GeneratedKnowledge = {
            ...current.source,
            ...regenerated,
          };
          const nextDraft: GeneratedKnowledge = {
            ...current.draft,
            ...(wasEdited ? {} : regenerated),
          };

          return {
            source: nextSource,
            draft: nextDraft,
            sections: {
              ...current.sections,
              [sectionId]: {
                ...current.sections[sectionId],
                state: wasEdited ? 'edited' : 'generated',
              },
            },
          };
        });
      } catch {
        setReview((current) => {
          if (!current) return current;
          return {
            ...current,
            sections: {
              ...current.sections,
              [sectionId]: {
                ...current.sections[sectionId],
                state: 'failed',
                error: 'request',
              },
            },
          };
        });
      } finally {
        setEditingSection((current) => (current === sectionId ? null : current));
      }
    },
    [word],
  );

  const persistencePayload = useMemo(
    (): KnowledgePersistencePayload | null =>
      review ? buildPersistencePayload(review) : null,
    [review],
  );

  return {
    review,
    editingSection,
    updateDraft,
    startEdit,
    finishEdit,
    cancelEdit,
    excludeSection,
    restoreSection,
    regenerateSection,
    persistencePayload,
  };
}
