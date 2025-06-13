import { CustomCard } from '@/components/custom/custom-card';
import { Button } from '@/components/ui/button';
import { useRequireQuery } from '@/hooks/use-require-query';
import { Plus } from 'lucide-react';

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState } from '@/components/custom/empty';
import { Loader } from '@/components/custom/loader';
import { ErrorState } from '@/components/custom/error';
import { RequireFormField } from '../require-form';
import { cn } from '@/lib/utils';

const RequireDetailPage = () => {
  const [formOpen, setFormOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const statusLabels: Record<string, Array<string>> = {
    RECEIVED: ['접수', 'bg-gray-400'],
    IN_PROGRESS: ['처리 중', 'bg-green-400'],
    COMPLETED: ['완료', 'bg-blue-400'],
    REJECTED: ['거절', 'bg-rose-400'],
  };

  const requireId = parseInt(id || '0', 10);
  const { data, isLoading, isError } = useRequireQuery(requireId);

  if (!id) return <EmptyState />;
  if (isLoading) return <Loader />;
  if (isError || !data) return <ErrorState />;

  return (
    <CustomCard
      title={
        <div className="flex justify-between">
          <h1>{data.title}</h1>
          <Button onClick={() => setFormOpen(!formOpen)}>
            <Plus className="w-4 h-4 mr-1" />
            요청 수정
          </Button>
        </div>
      }
      description={
        <div className="flex justify-end">
          <div className="flex gap-3 justify-center items-center">
            <span
              className={cn(
                'text-sm text-black px-2 py-1 rounded',
                statusLabels[data.status] && 'text-white',
                statusLabels[data.status][1],
              )}>
              {statusLabels[data.status][0]}
            </span>
            <span>작성일: {new Date(data.createdAt).toLocaleString()}</span>
          </div>
        </div>
      }
      content={
        <div className="border-t mt-3 pt-3 space-y-3">
          {data.description}
          <div className="text-sm text-gray-500">
            작성자: {data.userEmail} <br />
          </div>

          <RequireFormField formOpen={formOpen} />
        </div>
      }
    />
  );
};

export default RequireDetailPage;
