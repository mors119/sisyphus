import { FileX2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type EmptyStateProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  message?: string;
};

export function EmptyState({
  title,
  description,
  action,
  message,
}: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col items-center justify-center px-4 py-12 text-center">
      <FileX2
        className="mb-4 size-12 text-muted-foreground"
        aria-hidden="true"
      />
      <h2 className="text-lg font-semibold text-foreground">
        {title ?? t('temp.no_found_data')}
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description ?? message ?? t('temp.no_found_data_msg')}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
