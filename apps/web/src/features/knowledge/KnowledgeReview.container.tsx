import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { ErrorNotice } from '@/components/custom/Error';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { PageHeader } from '@/features/layout';

import { GeneratedField } from './GeneratedField.container';
import { CreatedKnowledgeNote } from './persistence.types';
import { REVIEW_SECTION_ORDER } from './review.constants';
import { useKnowledgePersistence } from './useKnowledgePersistence.hook';
import { useKnowledgeReview } from './useKnowledgeReview.hook';

type KnowledgeReviewProps = {
  word: string;
  enabled: boolean;
  onCompleted: (note: CreatedKnowledgeNote) => void;
};

export const KnowledgeReview = ({
  word,
  enabled,
  onCompleted,
}: KnowledgeReviewProps) => {
  const { t } = useTranslation();
  const persistence = useKnowledgePersistence();
  const reviewWorkspace = useKnowledgeReview(word, enabled);
  const { review, editingSection, persistencePayload } = reviewWorkspace;
  const saveErrorRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    if (!persistencePayload || persistence.isSaving) return;

    const savedNote = await persistence.save(persistencePayload);
    if (savedNote) {
      onCompleted(savedNote);
    }
  };

  useEffect(() => {
    if (persistence.phase !== 'error') return;
    saveErrorRef.current?.focus();
  }, [persistence.phase]);

  if (!review) return null;

  return (
    <section
      aria-labelledby="knowledge-review-heading"
      className="mx-auto w-full max-w-4xl py-6 md:py-10">
      <PageHeader
        title={
          <span id="knowledge-review-heading">
            {t('knowledge.review.heading')}
          </span>
        }
        description={t('knowledge.review.description', { word })}
      />

      <SectionHeader
        className="mt-8"
        title={t('knowledge.review.panelTitle')}
        description={t('knowledge.review.panelDescription')}
      />

      <div className="mt-6 grid gap-4">
        {REVIEW_SECTION_ORDER.map((sectionId) => (
          <GeneratedField
            key={sectionId}
            review={review}
            sectionId={sectionId}
            isEditing={editingSection === sectionId}
            onEdit={() => reviewWorkspace.startEdit(sectionId)}
            onCancelEdit={() => reviewWorkspace.cancelEdit(sectionId)}
            onFinishEdit={() => reviewWorkspace.finishEdit()}
            onChange={(value) => {
              if (sectionId === 'tags') {
                reviewWorkspace.updateDraft(
                  sectionId,
                  value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                    .map((name, index) => ({ id: Date.now() + index, name })),
                );
                return;
              }
              reviewWorkspace.updateDraft(sectionId, value);
            }}
            onRegenerate={() => void reviewWorkspace.regenerateSection(sectionId)}
            onExclude={() => reviewWorkspace.excludeSection(sectionId)}
            onRestore={() => reviewWorkspace.restoreSection(sectionId)}
          />
        ))}

        {persistence.phase === 'error' ? (
          <div ref={saveErrorRef} tabIndex={-1} className="outline-none">
            <ErrorNotice
              title={persistence.errorMessage}
              description={t('knowledge.completion.errors.preserved')}
              action={
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={persistence.isSaving}
                  onClick={() => void handleSave()}>
                  {t('knowledge.completion.actions.retrySave')}
                </Button>
              }
            />
          </div>
        ) : null}

        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only">
          {persistence.isSaving
            ? t('knowledge.review.actions.saving')
            : null}
        </div>

        <div className="sticky bottom-0 flex justify-end border-t border-border bg-background/95 pt-4 backdrop-blur">
          <Button
            type="button"
            variant="primary"
            size="lg"
            loading={persistence.isSaving}
            loadingLabel={t('knowledge.review.actions.saving')}
            disabled={!persistencePayload?.title.trim() || persistence.isSaving}
            onClick={() => void handleSave()}>
            {t('knowledge.review.actions.addToKnowledge')}
          </Button>
        </div>
      </div>
    </section>
  );
};
