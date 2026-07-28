import { useTranslation } from 'react-i18next';

import { PageContent, PageHeader, PageLayout } from '@/features/layout';
import { DashboardRequire } from './require/dashboardRequire.component';
import { DashboardTop } from './user/DashboardUser';

const DashboardPage = () => {
  const { t } = useTranslation();

  return (
    <PageLayout>
      <PageHeader title={t('item.dashboard')} />

      <PageContent width="wide" className="space-y-12">
        <section className="space-y-4">
          <h2 className="text-heading-3 font-semibold text-foreground">
            User and account
          </h2>
          <DashboardTop />
        </section>

        <section className="space-y-4 border-t border-border pt-12">
          <h2 className="text-heading-3 font-semibold text-foreground">
            New Request
          </h2>
          <DashboardRequire />
        </section>
      </PageContent>
    </PageLayout>
  );
};

export default DashboardPage;
