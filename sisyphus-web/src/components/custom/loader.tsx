import { useTranslation } from 'react-i18next';

export const Loader = ({ message }: { message?: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-10">
      <div className="animate-spin rounded-full border-4 border-blue-400 border-t-transparent h-12 w-12 mb-4" />
      <p className="text-sm text-gray-600 font-medium tracking-wide">
        {t('temp.loading')}
      </p>
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
};
