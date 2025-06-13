import { useState } from 'react';
import { useMyRequiresQuery } from '@/hooks/use-require-query';
import { RequireResponse } from '@/types/require';
import { CustomPagination } from '@/components/custom/custom-pagination';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronRightCircle, ChevronUpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RequireField = () => {
  const [page, setPage] = useState(0);
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const { data, isLoading, isError } = useMyRequiresQuery(page, 5);
  const statusLabels: Record<string, Array<string>> = {
    RECEIVED: ['접수', 'bg-gray-400'],
    IN_PROGRESS: ['처리 중', 'bg-green-400'],
    COMPLETED: ['완료', 'bg-blue-400'],
    REJECTED: ['거절', 'bg-rose-400'],
  };
  const navigate = useNavigate();

  return (
    <div className="w-full p-4 bg-white rounded-md shadow-sm border space-y-4">
      {/* 상태 처리 */}
      {isLoading && (
        <div className="text-center text-gray-500 py-8">로딩 중입니다...</div>
      )}
      {isError && (
        <div className="text-center text-red-500 py-8">
          오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </div>
      )}

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
                  onClick={() => navigate(`/require/${item.id}`)}
                  className="border rounded-md p-4 hover:bg-gray-50 transition-all">
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
                      <span className="font-semibold text-lg">
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
