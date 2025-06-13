import { useInfiniteNotesQuery } from '@/hooks/use-notes-query';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import { DashboardSheet } from '../../features/view/dashboard-sheet';
import { useNoteStore } from '@/stores/note-store';
import { CustomCard } from '@/components/custom/custom-card';
import { useQueryClient } from '@tanstack/react-query';
import { Category } from '@/types/note';
import { DashboardTable } from '../../features/view/dashboard-table';

const DashboardPage = () => {
  const [cateOpen, setCateOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [deleteNum, setDeleteNum] = useState<number>(0);
  const [openSheet, setOpenSheet] = useState(false);
  const { category, setCategory, sortOption, editNote } = useNoteStore();

  // 노트 무한 쿼리
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteNotesQuery(category, sortOption);
  const queryClient = useQueryClient();

  // key오류 방지를 위해 정렬 조건 바뀌면 remove()로 캐시 초기화
  useEffect(() => {
    queryClient.removeQueries({
      queryKey: ['notes', category, sortOption],
      exact: true,
    });

    // 선택적으로 즉시 불러오기
    fetchNextPage();
  }, [sortOption]);

  // delete 뮤태이션

  // TODO: 4. category 자리에 tag로 정렬하기, category 선택 부분은 상단으로 옮기기
  // TODO: 5. mobile 사이즈 일 때 sheet w-full

  return (
    <CustomCard
      title={
        <div className="relative">
          <Button
            variant="ghost"
            className="hover:scale-105 hover:text-[#1186ce] font-bold"
            onClick={() => {
              if (!data?.pages.length || data.pages[0].content.length === 0) {
                setCategory('ALL');
                return;
              }
              setCateOpen(!cateOpen);
            }}>
            DASHBOARD {cateOpen ? '▲' : '▼'}
          </Button>
          {cateOpen && (
            <ul className="absolute left-0 top-full mt-1 w-32 border bg-white z-10 shadow-md">
              {[
                { label: '전체', value: 'ALL' },
                { label: '단어', value: 'WORD' },
                { label: '노트', value: 'NOTE' },
                { label: '일정', value: 'TODO' },
              ].map(({ label, value }) => (
                <li key={value}>
                  <Button
                    variant="ghost"
                    className="w-full text-left px-2 py-1"
                    onClick={() => {
                      setCategory(value as Category);
                      setCateOpen(false);
                    }}>
                    {label}
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <span className="ml-2">{category}</span>
        </div>
      }
      content={
        <>
          <DashboardTable
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            deleteNum={deleteNum}
            setDeleteNum={setDeleteNum}
            data={data}
            alertOpen={alertOpen}
            setAlertOpen={setAlertOpen}
            setOpenSheet={setOpenSheet}
            sortOption={sortOption}
          />
          {/* ViewSheet */}
          <div
            className={cn(
              'absolute left-0 top-0 w-full h-full z-40 translate-x-full duration-300 flex justify-end',
              editNote.id !== 0 && openSheet && 'translate-x-0',
            )}>
            <div className="w-3/4 h-full">
              <DashboardSheet
                openSheet={openSheet}
                setAlertOpen={setAlertOpen}
                setDeleteNum={setDeleteNum}
              />
            </div>
          </div>
        </>
      }
    />
  );
};

export default DashboardPage;
