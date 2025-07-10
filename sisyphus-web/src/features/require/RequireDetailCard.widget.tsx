import { CustomCard } from '@/components/custom/customCard';
import { Button } from '@/components/ui/button';
import { useRequireQuery } from '@/features/require/useRequireQuery.query';
import { Plus } from 'lucide-react';
import { RequireFormField } from './RequireFormField.container';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState } from '@/components/custom/Empty';
import { Loader } from '@/components/custom/Loader';
import { ErrorState } from '@/components/custom/Error';

export const RequireDetail = () => {
  const [formOpen, setFormOpen] = useState(false);
  const { id } = useParams<{ id: string }>();

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
      description={data.description}
      content={
        <div className="border-t mt-3 pt-3 space-y-3">
          <div>
            <span className="text-sm text-gray-600">상태:</span>{' '}
            <span className="text-sm font-medium">{data.status}</span>
          </div>
          <div className="text-sm text-gray-500">
            작성자: {data.userEmail} <br />
            작성일: {new Date(data.createdAt).toLocaleString()}
          </div>

          <RequireFormField formOpen={formOpen} />
        </div>
      }
      footer={
        <span className="w-full text-end text-sm text-gray-500">
          heesk0223@gmail.com
        </span>
      }
    />
  );
};
