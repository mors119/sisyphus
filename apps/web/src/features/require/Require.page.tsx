import { PageContent, PageHeader, PageLayout } from '@/features/layout';
import RequireTop from './require-home/RequireTop.presenter';
import { RequireChart } from './require-home/RequireChart.container';
import { useState } from 'react';
import { RequireWrite } from './require-write/RequireWrite.widget';
import { RequireCate } from './require.types';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/auth.store';
import { useMyRequiresQuery } from './useRequireQuery.query';
import { toast } from 'sonner';
import { LoadingState } from '@/components/custom/Loader';
import { useTranslation } from 'react-i18next';

const RequirePage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<RequireCate>(RequireCate.Bug);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const { data, isLoading } = useMyRequiresQuery(0, 100);

  if (isLoading) return <LoadingState />;

  return (
    <PageLayout>
      <PageHeader
        title={t('require.home.tit')}
        description={
          <>
            <span className="font-medium text-foreground">
              {t('require.home.span')}
            </span>
            {t('require.home.sub')}
          </>
        }
      />

      <PageContent width="medium" className="space-y-10">
        <RequireTop
          onReportBug={() => {
            setIsOpen(true);
            setType(RequireCate.Bug);
          }}
          onRequestFeature={() => {
            setIsOpen(true);
            setType(RequireCate.New);
          }}
          onViewMyRequests={() =>
            data.content.length > 0 && user
              ? navigate(`/require/${user.id}`)
              : toast.error('제출된 요청 사항이 없습니다.')
          }
          otherLinkHref="/contact"
        />

        <section className="border-t border-border pt-10">
          {data.content.length > 0 ? (
            <RequireChart />
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              제출된 요청사항이 없습니다.
            </p>
          )}
        </section>
      </PageContent>

      <RequireWrite isOpen={isOpen} setIsOpen={setIsOpen} type={type} />
    </PageLayout>
  );
};

export default RequirePage;
