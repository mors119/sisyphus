import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/auth.store';
import { useAlert } from '@/hooks/useAlert';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { alertMessage } = useAlert();
  const location = useLocation();
  const { t } = useTranslation();
  const alertedRef = useRef(false);

  useEffect(() => {
    if (!accessToken && !alertedRef.current) {
      alertedRef.current = true;
      alertMessage(t('access.restrictions'), {
        description: t('auth.required'),
        duration: 2000,
      });
    }

    if (accessToken) {
      alertedRef.current = false;
    }
  }, [accessToken, alertMessage, t]);

  if (!accessToken) {
    return (
      <Navigate
        to={`/auth/signin?alert=auth_required`}
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
};
