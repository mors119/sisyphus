import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import axios from 'axios';

// Oauth 리다이렉트 지점
export const OauthSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      setAccessToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/');
    } else {
      navigate('/auth');
    }
  }, [location.search, navigate, setAccessToken]);

  return <div>로그인 중입니다...</div>;
};
