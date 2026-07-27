import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ErrorNotice } from '@/components/custom/Error';

import { formatTagsDisplay, getSectionValue } from './review.adapter';
import {
  REVIEW_SECTION_I18N_KEY,
  REVIEW_STATUS_I18N_KEY,
} from './review.constants';
import {
  KnowledgeReviewState,
  ReviewSectionId,
  ReviewSectionState,
} from './review.types';

type GeneratedFieldProps = {
  review: KnowledgeReviewState;
  sectionId: ReviewSectionId;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onFinishEdit: () => void;
  onChange: (value: string) => void;
  onRegenerate: () => void;
  onExclude: () => void;
  onRestore: () => void;
};

function statusBadgeVariant(state: ReviewSectionState) {
  switch (state) {
    case 'edited':
      return 'warning' as const;
    case 'excluded':
      return 'outline' as const;
    case 'failed':
      return 'destructive' as const;
    case 'regenerating':
      return 'secondary' as const;
    default:
      return 'success' as const;
  }
}

export const GeneratedField = ({
  review,
  sectionId,
  isEditing,
  onEdit,
  onCancelEdit,
  onFinishEdit,
  onChange,
  onRegenerate,
  onExclude,
  onRestore,
}: GeneratedFieldProps) => {
  const { t } = useTranslation();
  const meta = review.sections[sectionId];
  const label = t(REVIEW_SECTION_I18N_KEY[sectionId]);
  const value = getSectionValue(review, sectionId);
  const multiline =
    sectionId === 'definitions' ||
    sectionId === 'example' ||
    sectionId === 'image';

  return (
    <Card
      variant={meta.excluded ? 'default' : 'interactive'}
      className={meta.excluded ? 'opacity-70' : undefined}
      aria-labelledby={`review-section-${sectionId}`}>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle id={`review-section-${sectionId}`} className="text-base">
            {label}
            {meta.optional ? (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                ({t('knowledge.review.optional')})
              </span>
            ) : null}
          </CardTitle>
          <Badge variant={statusBadgeVariant(meta.state)}>
            {t(REVIEW_STATUS_I18N_KEY[meta.state])}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {meta.state === 'failed' ? (
          <ErrorNotice
            title={t('knowledge.review.errors.section')}
            description={t('knowledge.review.errors.preserved')}
          />
        ) : null}

        {meta.excluded ? (
          <p className="text-sm text-muted-foreground">
            {t('knowledge.review.excludedMessage')}
          </p>
        ) : isEditing && sectionId === 'tags' ? (
          <Field label={label}>
            <Input
              value={review.draft.tags.map((tag) => tag.name).join(', ')}
              onChange={(event) => onChange(event.target.value)}
            />
          </Field>
        ) : isEditing ? (
          <Field label={label}>
            {multiline ? (
              <Textarea
                value={value}
                rows={sectionId === 'definitions' ? 4 : 3}
                onChange={(event) => onChange(event.target.value)}
              />
            ) : (
              <Input
                value={value}
                onChange={(event) => onChange(event.target.value)}
              />
            )}
          </Field>
        ) : sectionId === 'tags' ? (
          <p className="text-sm text-foreground">
            {formatTagsDisplay(review.draft.tags) || t('knowledge.review.empty')}
          </p>
        ) : (
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {value || t('knowledge.review.empty')}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        {!meta.excluded && !isEditing ? (
          <>
            <Button type="button" variant="secondary" size="sm" onClick={onEdit}>
              {t('edit')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              loading={meta.state === 'regenerating'}
              loadingLabel={t('knowledge.review.actions.regenerating')}
              onClick={onRegenerate}>
              {t('knowledge.review.actions.regenerate')}
            </Button>
          </>
        ) : null}

        {isEditing ? (
          <>
            <Button type="button" variant="primary" size="sm" onClick={onFinishEdit}>
              {t('knowledge.review.actions.applyEdit')}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onCancelEdit}>
              {t('cancel')}
            </Button>
          </>
        ) : null}

        {meta.optional && !meta.excluded ? (
          <Button type="button" variant="ghost" size="sm" onClick={onExclude}>
            {t('knowledge.review.actions.exclude')}
          </Button>
        ) : null}

        {meta.excluded || meta.state === 'failed' ? (
          <Button type="button" variant="secondary" size="sm" onClick={onRestore}>
            {t('knowledge.review.actions.restore')}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
};
