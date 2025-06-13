import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { useAlert } from '@/hooks/use-alert';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { alertMessage } = useAlert();

  if (!accessToken) {
    alertMessage('접근 제한', {
      description: '로그인이 필요한 서비스 입니다.',
      duration: 2000,
    });
  }

  return accessToken ? (
    children
  ) : (
    <Navigate to="/auth" replace state={{ from: location.pathname }} />
  );
};
