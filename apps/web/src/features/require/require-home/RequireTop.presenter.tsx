import { Button } from '@/components/ui/button';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface RequestCardProps {
  onReportBug: () => void;
  onRequestFeature: () => void;
  onViewMyRequests: () => void;
  otherLinkHref: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  note?: React.ReactNode;
}

export default function RequireTop({
  onReportBug,
  onRequestFeature,
  onViewMyRequests,
}: RequestCardProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {t('require.home.sub2')}
        <br />
        {t('require.home.text')}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="button"
          className="w-full sm:w-auto"
          aria-label={t('require.home.bug')}
          onClick={onReportBug}>
          {t('require.home.bug')}
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          aria-label={t('require.home.req')}
          onClick={onRequestFeature}>
          {t('require.home.req')}
        </Button>

        <Button
          variant="ghost"
          type="button"
          className="w-full sm:w-auto"
          aria-label={t('require.home.my')}
          onClick={onViewMyRequests}>
          {t('require.home.my')}
        </Button>
      </div>

      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {t('require.home.ex')}
      </p>
    </div>
  );
}
