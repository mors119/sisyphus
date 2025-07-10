import { PATHS } from '@/app/router/paths.constants';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-4xl font-bold mb-4">{t('notFound.title')}</h1>
      <p className="text-lg text-muted-foreground mb-6">
        {t('notFound.message')}
      </p>
      <Button onClick={() => navigate(PATHS.HOME)}>
        {t('notFound.toHome')}
      </Button>
    </div>
  );
};

export default NotFoundPage;
