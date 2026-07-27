import { useTranslation } from 'react-i18next';

import { LoadingState } from '@/components/custom/Loader';
import { ProgressList, ProgressListItem } from '@/components/ui/progress-list';
import { PageHeader } from '@/features/layout';

type ExpansionProgressProps = {
  word: string;
  steps: ProgressListItem[];
};

export const ExpansionProgress = ({ word, steps }: ExpansionProgressProps) => {
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

      <LoadingState
        compact
        message={t('knowledge.expansion.loading')}
        description={t('knowledge.expansion.loadingDescription')}
      />

      <ProgressList
        label={t('knowledge.expansion.label')}
        items={steps}
      />
    </section>
  );
};
