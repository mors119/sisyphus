import { useEffect } from 'react';

import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import { useAuthStore } from '@/features/auth/auth.store';
import {
  bootstrapAuthSession,
  stripLegacyCredentialParams,
} from '@/features/auth/auth.session';
import { useInitTheme } from '@/features/theme/useInitTheme.hook';
import { Loader } from '@/components/custom/Loader';

stripLegacyCredentialParams();

const App = () => {
  useInitTheme(); // 시작 시 다크 모드 설정
  const authStatus = useAuthStore((state) => state.status);

  useEffect(() => {
    void bootstrapAuthSession();
  }, []);

  if (authStatus === 'bootstrapping') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export default App;
