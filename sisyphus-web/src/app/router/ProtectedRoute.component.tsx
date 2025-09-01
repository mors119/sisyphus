import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/auth.store';
import { useAlert } from '@/hooks/useAlert';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { alertMessage } = useAlert();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!accessToken) {
      alertMessage(t('access.restrictions'), {
        description: t('auth.required'),
        duration: 2000,
      });
      setShouldRedirect(true);
    }
  }, [accessToken, alertMessage, t]);

  if (shouldRedirect) {
    return (
      <Navigate
        to={`/auth/signin?alert=auth_required`}
        replace
        state={{ from: location }}
      />
    );
  }

  if (!accessToken) {
    // 아직 리다이렉트 전이라면 아무 것도 렌더링하지 않음
    return null;
  }

  return children;
};
