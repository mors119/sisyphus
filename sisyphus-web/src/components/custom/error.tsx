import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ErrorState = ({ message }: { message?: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center text-center w-full py-12 text-red-500">
      <AlertTriangle className="h-12 w-12 mb-4 text-red-400" />
      <p className="text-lg font-semibold">{t('temp.something_went_wrong')}</p>
      <p className="text-sm text-red-400">
        {message || t('temp.something_went_wrong_msg')}
      </p>
    </div>
  );
};
