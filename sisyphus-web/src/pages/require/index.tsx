import { CustomCard } from '@/components/custom/custom-card';
import { RequireFormField } from './require-form';
import { RequireField } from './require-field';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const RequirePage = () => {
  const [formOpen, setFormOpen] = useState(false);

  // TODO: comment
  // TODO: admin(status, ListAll, delete, update)
  return (
    <CustomCard
      title={
        <div className="flex justify-between">
          <h1>요청사항</h1>
          <Button onClick={() => setFormOpen(!formOpen)}>
            <Plus />
            요청하기
          </Button>
        </div>
      }
      description={
        '요청사항을 편안하게 작성해주세요. 빠르게 더 좋은 컨텐츠로 답해드리겠습니다.'
      }
      content={
        <div className="border-t mt-3 pt-3">
          <RequireFormField formOpen={formOpen} />
          <RequireField />
        </div>
      }
      footer={<span className="w-full text-end">heesk0223@gmail.com</span>}
    />
  );
};

export default RequirePage;
