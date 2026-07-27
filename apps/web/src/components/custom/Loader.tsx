import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

type LoadingStateProps = {
  message?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  compact?: boolean;
};

export function LoadingState({
  message,
  description,
  className,
  compact = false,
}: LoadingStateProps) {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex w-full flex-col items-center justify-center text-center',
        compact ? 'py-6' : 'min-h-[12rem] py-10',
        className,
      )}>
      <Loader2
        className="mb-4 size-10 animate-spin text-action-primary"
        aria-hidden="true"
      />
      <p className="text-sm font-medium tracking-wide text-foreground">
        {message ?? t('temp.loading')}
      </p>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
      <span className="sr-only">{t('temp.loading')}</span>
    </div>
  );
}

export const Loader = LoadingState;
