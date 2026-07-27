import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/auth.store';
import { PATHS } from '@/app/router/paths.constants';
import { Loader } from '@/components/custom/Loader';

// Oauth 리다이렉트 지점
export default function OauthSuccessPage() {
  const navigate = useNavigate();
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    if (status === 'authenticated') {
      navigate(PATHS.HOME, { replace: true });
    }
    if (status === 'unauthenticated') {
      navigate(PATHS.AUTH, { replace: true });
    }
  }, [navigate, status]);

  return (
    <div className="h-screen flex justify-center items-center">
      <Loader />
    </div>
  );
}
