import { useEffect } from 'react';

import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import { useAuthStore } from '@/features/auth/auth.store';
import { useInitTheme } from '@/features/theme/useInitTheme.hook';

const App = () => {
  useInitTheme(); // 시작 시 다크 모드 설정

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      useAuthStore.getState().setAccessToken(token);
    }
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
