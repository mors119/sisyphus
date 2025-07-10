import { FileX2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const EmptyState = ({ message }: { message?: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center text-center w-full py-12 text-gray-500">
      <FileX2 className="h-12 w-12 mb-4 text-gray-400" />
      <p className="text-lg font-semibold">{t('temp.no_found_data')}</p>
      <p className="text-sm text-gray-400">
        {message || t('temp.no_found_data_msg')}
      </p>
    </div>
  );
};
