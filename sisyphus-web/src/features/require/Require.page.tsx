import RequireTop from './require-home/RequireTop.presenter';
import { CustomCard } from '@/components/custom/customCard';
import { RequireChart } from './require-home/RequireChart.container';
import { useState } from 'react';
import { RequireWrite } from './require-write/RequireWrite.widget';
import { RequireCate } from './require.types';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/auth.store';

const RequirePage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<RequireCate>(RequireCate.Bug);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div>
      <CustomCard
        className="max-h-[calc(100vh - 56px)] h-full"
        content={
          <>
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
                user !== null
                  ? navigate(`/require/${user.id}`)
                  : navigate('/auth/signin?alert=auth_required')
              }
              otherLinkHref="/contact"
            />
            <div className="w-full flex justify-center pt-4">
              <RequireChart />
            </div>
          </>
        }
      />
      <RequireWrite isOpen={isOpen} setIsOpen={setIsOpen} type={type} />
    </div>
  );
};

export default RequirePage;
