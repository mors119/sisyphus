import { useState } from 'react';
import { CustomPagination } from '@/components/custom/customPagination';
import { Button } from '@/components/ui/button';
import { ChevronRightCircle, ChevronUpCircle } from 'lucide-react';
import { useFetchRequire } from '../useDashboardQuery.query';
import { RequireResponse } from '@/features/require/require.types';
import { Loader } from '@/components/custom/Loader';
import { ErrorState } from '@/components/custom/Error';
import { RequireStatusSelect } from './RequireStateusSelect';
import { useUpdateRequireStatusMutation } from '@/features/require/useRequireQuery.query';

export const DashboardRequire = () => {
  const [page, setPage] = useState(0);
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const { data, isLoading, isError } = useFetchRequire(page, 3);

  const updateStatus = useUpdateRequireStatusMutation();

  if (isLoading) return <Loader />;
  if (isError || !data) return <ErrorState />;

  return (
    <div className="w-full space-y-4">
      {!isLoading && !isError && data && (
        <>
          <ul className="space-y-3">
            {data.content.length === 0 ? (
              <li className="text-center text-sm text-muted-foreground">
                요청사항이 없습니다.
              </li>
            ) : (
              data.content.map((item: RequireResponse) => (
                <li
                  key={item.id}
                  className="rounded-[var(--radius-role-card)] border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Button
                      variant="ghost"
                      className="h-auto min-h-10 justify-start px-2 text-left"
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
                      <span className="text-base font-semibold text-foreground">
                        {item.title}
                      </span>
                    </Button>

                    <RequireStatusSelect
                      id={item.id}
                      value={item.status}
                      onChangeStatus={({ id, status }) => {
                        updateStatus.mutate({ id, status });
                      }}
                    />
                  </div>
                  <div className="px-2">
                    {openItemId === item.id && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>

          <div className="pt-2">
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
