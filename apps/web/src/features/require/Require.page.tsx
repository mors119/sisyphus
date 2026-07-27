import { PageContent, PageLayout } from '@/features/layout';
import RequireTop from './require-home/RequireTop.presenter';
import { CustomCard } from '@/components/custom/customCard';
import { RequireChart } from './require-home/RequireChart.container';
import { useState } from 'react';
import { RequireWrite } from './require-write/RequireWrite.widget';
import { RequireCate } from './require.types';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/auth.store';
import { useMyRequiresQuery } from './useRequireQuery.query';
import { toast } from 'sonner';
import { LoadingState } from '@/components/custom/Loader';

const RequirePage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<RequireCate>(RequireCate.Bug);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data, isLoading } = useMyRequiresQuery(0, 100);

  if (isLoading) return <LoadingState />;

  return (
    <PageLayout className="h-full">
      <PageContent width="wide" className="h-full">
        <CustomCard
          className="h-full md:px-4 md:py-4"
          content={
            <div className="h-full">
              <RequireTop
                onReportBug={() => {
                  setIsOpen(!isOpen);
                  setType(RequireCate.Bug);
                }}
                onRequestFeature={() => {
                  setIsOpen(!isOpen);
                  setType(RequireCate.New);
                }}
                onViewMyRequests={() =>
                  data.content.length > 0 && user
                    ? navigate(`/require/${user.id}`)
                    : toast.error('제출된 요청 사항이 없습니다.')
                }
                otherLinkHref="/contact"
              />
              <div className="flex w-full justify-center pt-4">
                {data.content.length > 0 ? (
                  <RequireChart />
                ) : (
                  <p>제출된 요청사항이 없습니다.</p>
                )}
              </div>
            </div>
          }
        />
      </PageContent>

      <RequireWrite isOpen={isOpen} setIsOpen={setIsOpen} type={type} />
    </PageLayout>
  );
};

export default RequirePage;
