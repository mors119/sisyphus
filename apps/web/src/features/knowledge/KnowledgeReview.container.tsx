import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { PageHeader } from '@/features/layout';
import { useAlert } from '@/hooks/useAlert';
import { invalidateQuery } from '@/lib/react-query';
import { useCreateNoteMutation } from '../view/useView.mutation';

import { GeneratedField } from './GeneratedField.container';
import { REVIEW_SECTION_ORDER } from './review.constants';
import { useKnowledgeReview } from './useKnowledgeReview.hook';

type KnowledgeReviewProps = {
  word: string;
  enabled: boolean;
  onSaved: () => void;
};

export const KnowledgeReview = ({
  word,
  enabled,
  onSaved,
}: KnowledgeReviewProps) => {
  const { t } = useTranslation();
  const { alertMessage } = useAlert();
  const createMutation = useCreateNoteMutation();
  const reviewWorkspace = useKnowledgeReview(word, enabled);
  const { review, editingSection, persistencePayload } = reviewWorkspace;

  const handleSave = async () => {
    if (!persistencePayload) return;

    reviewWorkspace.setIsSaving(true);
    try {
      await createMutation.mutateAsync({
        title: persistencePayload.title,
        subTitle: persistencePayload.subTitle,
        description: persistencePayload.description,
        tags: persistencePayload.tags,
        categoryId: undefined,
        imageId: persistencePayload.imageId,
      });
      await invalidateQuery(['notes']);
      alertMessage(t('knowledge.review.save.success'));
      onSaved();
    } catch {
      alertMessage(t('knowledge.review.save.error'));
    } finally {
      reviewWorkspace.setIsSaving(false);
    }
  };

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

        <div className="sticky bottom-0 flex justify-end border-t border-border bg-background/95 pt-4 backdrop-blur">
          <Button
            type="button"
            variant="primary"
            size="lg"
            loading={reviewWorkspace.isSaving || createMutation.isPending}
            loadingLabel={t('knowledge.review.actions.saving')}
            disabled={!persistencePayload?.title.trim()}
            onClick={() => void handleSave()}>
            {t('knowledge.review.actions.addToKnowledge')}
          </Button>
        </div>
      </div>
    </section>
  );
};
