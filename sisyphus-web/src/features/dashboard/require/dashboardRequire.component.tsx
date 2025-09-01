import { useState } from 'react';
import { CustomPagination } from '@/components/custom/customPagination';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronRightCircle, ChevronUpCircle } from 'lucide-react';
import { useFetchRequire } from '../useDashboardQuery.query';
import { RequireResponse } from '@/features/require/require.types';
import { Loader } from '@/components/custom/Loader';
import { ErrorState } from '@/components/custom/Error';

export const DashboardRequire = () => {
  const [page, setPage] = useState(0);
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const { data, isLoading, isError } = useFetchRequire(page, 3);
  const statusLabels: Record<string, Array<string>> = {
    RECEIVED: ['접수', 'bg-gray-400'],
    IN_PROGRESS: ['처리 중', 'bg-green-400'],
    COMPLETED: ['완료', 'bg-blue-400'],
    REJECTED: ['거절', 'bg-rose-400'],
  };

  if (isLoading) return <Loader />;
  if (isError || !data) return <ErrorState />;

  return (
    <div className="w-full p-2 rounded-md shadow-sm  space-y-4">
      {/* 상태 처리 */}
      {!isLoading && !isError && data && (
        <>
          <ul className="space-y-3">
            {data.content.length === 0 ? (
              <li className="text-gray-500 text-center">
                요청사항이 없습니다.
              </li>
            ) : (
              data.content.map((item: RequireResponse) => (
                <li
                  key={item.id}
                  // onClick={() => navigate(`/require/${item.id}`)}
                  className="border rounded-md p-4 hover:bg-zinc-500">
                  <div className="flex justify-between items-center">
                    <Button
                      className=""
                      variant="ghost"
                      onClick={() =>
                        setOpenItemId((prev) =>
                          prev === item.id ? null : item.id,
                        )
                      }>
                      {openItemId === item.id ? (
                        <ChevronUpCircle />
                      ) : (
                        <ChevronRightCircle />
                      )}
                      <span className="font-semibold text-lg hover:text-black">
                        {item.title}
                      </span>
                    </Button>

                    <span
                      className={cn(
                        'text-sm text-black px-2 py-1 rounded',
                        statusLabels[item.status] && 'text-white',
                        statusLabels[item.status][1],
                      )}>
                      {statusLabels[item.status][0]}
                    </span>
                  </div>
                  <div className="px-3">
                    {openItemId === item.id && (
                      <p className="mt-1 text-gray-700 text-sm">
                        {item.description}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>

          <div className="pt-4">
            <CustomPagination
              totalPages={data.totalPages}
              page={page}
              setPage={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};
