import { useState } from 'react';
import { useMyRequiresQuery } from '../useRequireQuery.query';
import { CustomPagination } from '@/components/custom/customPagination';
import { Loader } from '@/components/custom/Loader';
import { ErrorState } from '@/components/custom/Error';
import { CustomCard } from '@/components/custom/customCard';
import { cn } from '@/lib/utils';
import { RequireResponse } from '../require.types';
import { useDayjs } from '@/hooks/useDayjs.hook';
import { RequireSheet } from '../require-detail/RequireSheet.page';
import { useSearchParams } from 'react-router-dom';
import { STATUS_LABELS } from '../require.constants';
import { useTranslation } from 'react-i18next';

const RequireViewPage = () => {
  const [page, setPage] = useState(0);
  const { formatDate } = useDayjs();
  const [isOpen, setIsOpen] = useState(false);
  const [, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const typeLabels: Record<string, string> = {
    BUG: 'require.view.bug',
    NEW: 'require.view.req',
  };

  const { data, isLoading, error } = useMyRequiresQuery(page, 5);

  const totalPages = data?.totalPages ?? 1;

  if (isLoading || !data) return <Loader />;
  if (error) return <ErrorState />;

  // 댓글 기능 추가 시 사용
  // const commentsLabel = (n: number) => (n > 0 ? `댓글 ${n}` : '댓글 없음');

  return (
    <div className="p-2">
      {data.content.map((v: RequireResponse) => (
        <CustomCard
          onClick={() => {
            if (!isOpen) {
              setSearchParams({ id: String(v.id) });
            } else {
              setSearchParams({});
            }
            setIsOpen(!isOpen);
          }}
          className="hover:bg-zinc-100 duration-200 cursor-pointer"
          key={v.id}
          title={
            <div className="flex justify-between items-center">
              <span>
                {v.title}{' '}
                <span className="text-sm text-zinc-600">
                  ({t(typeLabels[v.requireType])})
                </span>
              </span>
              <span
                className={cn(
                  'inline-block w-fit px-3 py-0.5 text-center rounded-full text-xs font-semibold',
                  STATUS_LABELS[v.status][1],
                )}>
                {t(STATUS_LABELS[v.status][0])}
              </span>
            </div>
          }
          content={
            <div className="p-4">
              <p className="text-sm text-zinc-700 truncate">{v.description}</p>
              <p className="w-full text-end">
                {/* 댓글 기능 추가 시  */}
                {/* <span className="text-xs text-zinc-500 mx-3">
                  {commentsLabel(v.comments?.length ?? 0)}
                </span> */}
                <span>{formatDate(v.createdAt)}</span>
              </p>
            </div>
          }
        />
      ))}
      {data && (
        <CustomPagination
          className="mt-4"
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}
      <RequireSheet isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default RequireViewPage;
