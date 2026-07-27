import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ErrorNoticeProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  message?: string;
  className?: string;
};

export function ErrorNotice({
  title,
  description,
  action,
  message,
  className,
}: ErrorNoticeProps) {
  const { t } = useTranslation();

  return (
    <Alert variant="destructive" className={className}>
      <AlertTriangle aria-hidden="true" />
      <AlertTitle>{title ?? t('temp.something_went_wrong')}</AlertTitle>
      <AlertDescription>
        <p>{description ?? message ?? t('temp.something_went_wrong_msg')}</p>
        {action ? <div className="mt-4">{action}</div> : null}
      </AlertDescription>
    </Alert>
  );
}

export function ErrorState(props: ErrorNoticeProps) {
  return (
    <div className="flex w-full justify-center px-4 py-12">
      <ErrorNotice {...props} className="max-w-lg" />
    </div>
  );
}
