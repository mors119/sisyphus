import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserFormCard } from './UserFormCard.container';
import { DeleteUserAlert } from './DeleteUserAlert.container';
import { useUserDetailQuery } from './useUser.query';
import { useTranslation } from 'react-i18next';
import { CustomCard } from '@/components/custom/customCard';
import { Loader } from '@/components/custom/Loader';
import { useEffect } from 'react';
import { PATHS } from '@/app/router/paths.constants';
import { useAlert } from '@/hooks/useAlert';

const UserPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [read, setRead] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { data: userDetailData, isLoading } = useUserDetailQuery();

  const [params] = useSearchParams();
  const { alertMessage } = useAlert();
  const state = params.get('state');

  useEffect(() => {
    if (state === 'success') {
      alertMessage(t('auth.success'));
    } else if (state === 'false') {
      alertMessage(t('auth.error'), { description: t('signup.already') });
    }
  }, [state]);

  // TODO: UserDetail을 안전하게 처리하는 것 고민하기
  // TODO: 비밀번호 찾기
  // navigate는 렌더링 도중 실행하면 안 됨 → useEffect 안에서 안전하게 처리
  useEffect(() => {
    if (!isLoading && !userDetailData) {
      navigate(PATHS.HOME);
    }
  }, [isLoading, userDetailData, navigate]);

  if (isLoading) return <Loader />;

  // navigate()를 호출했더라도 여전히 렌더링이 한 번은 발생함 → null로 안전하게 처리
  if (!userDetailData) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <CustomCard
        title={<h1 className="mb-3">{t('user.manageAccount')}</h1>}
        content={
          <UserFormCard
            user={userDetailData}
            read={read}
            setRead={setRead}
            onDeleteRequest={() => setShowDeleteDialog(true)}
          />
        }
        footer={
          <DeleteUserAlert
            open={showDeleteDialog}
            setOpen={setShowDeleteDialog}
          />
        }
      />
    </div>
  );
};

export default UserPage;
