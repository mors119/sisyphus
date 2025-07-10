import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';
import { useAuthStore } from '@/features/auth/auth.store';
import { PATHS } from '@/app/router/paths.constants';
import { Loader } from '@/components/custom/Loader';

// Oauth 리다이렉트 지점
export default function OauthSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      setAccessToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate(PATHS.HOME);
    } else {
      navigate(PATHS.AUTH);
    }
  }, [location.search, navigate, setAccessToken]);

  return (
    <div className="h-[100vh] flex justify-center items-center">
      <Loader />
    </div>
  );
}
