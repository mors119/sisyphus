import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressList } from '@/components/ui/progress-list';
import { PageHeader } from '@/features/layout';

import { ExpansionStageId } from './expansion.types';
import { ExpansionProgressListItem } from './useExpansionPipeline.hook';

type ExpansionProgressProps = {
  word: string;
  items: ExpansionProgressListItem[];
  announcement: string | null;
  onRetryStage: (stageId: ExpansionStageId) => void;
  onContinueStage: (stageId: ExpansionStageId) => void;
};

export const ExpansionProgress = ({
  word,
  items,
  announcement,
  onRetryStage,
  onContinueStage,
}: ExpansionProgressProps) => {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="expansion-progress-heading"
      className="mx-auto flex w-full max-w-xl flex-col gap-8 py-6 md:py-12">
      <PageHeader
        title={
          <span id="expansion-progress-heading">
            {t('knowledge.expansion.heading')}
          </span>
        }
        description={t('knowledge.expansion.description', { word })}
      />

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {t('knowledge.expansion.wordLabel')}
        </span>
        <Badge variant="secondary" className="text-base font-semibold">
          {word}
        </Badge>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <ProgressList
        label={t('knowledge.expansion.label')}
        items={items.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          state: item.state,
          action:
            item.actions?.retry || item.actions?.continue ? (
              <div className="flex flex-wrap gap-2">
                {item.actions.retry ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => onRetryStage(item.id)}>
                    {t('knowledge.expansion.actions.retry')}
                  </Button>
                ) : null}
                {item.actions.continue ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onContinueStage(item.id)}>
                    {t('knowledge.expansion.actions.continue')}
                  </Button>
                ) : null}
              </div>
            ) : undefined,
        }))}
      />
    </section>
  );
};
