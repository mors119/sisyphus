import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-4xl font-bold mb-4">
        404 - 페이지를 찾을 수 없습니다
      </h1>
      <p className="text-lg text-muted-foreground mb-6">
        요청하신 페이지가 존재하지 않거나, 이동되었을 수 있어요.
      </p>
      <Button onClick={() => navigate('/')}>홈으로 돌아가기</Button>
    </div>
  );
};

export default NotFoundPage;
