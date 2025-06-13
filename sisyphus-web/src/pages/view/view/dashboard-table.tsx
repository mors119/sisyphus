import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatRelativeDate } from '@/utils/format-date';
import { useNoteStore } from '@/stores/note-store';
import { useNoteLabels } from '@/hooks/use-note-label';
import { useColor } from '@/hooks/use-color';
import { useCallback, useRef } from 'react';
import { useDeleteNoteMutation } from '@/hooks/use-notes-query';
import { CustomAlert } from '@/components/custom/custom-alert';
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query';
import { NotePageResponse, SortOption } from '@/types/note';
import { Loader } from '@/components/custom/loader';
import { EmptyState } from '@/components/custom/empty';
import { DeleteBtn } from '@/components/custom/custom-button';

interface DashboardTableProps {
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions,
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<NotePageResponse>, Error>
  >;
  deleteNum: number;
  setDeleteNum: React.Dispatch<React.SetStateAction<number>>;
  data: InfiniteData<NotePageResponse, unknown> | undefined;
  alertOpen: boolean;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
  sortOption: SortOption;
}
export const DashboardTable = ({
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  deleteNum,
  setDeleteNum,
  data,
  alertOpen,
  setAlertOpen,
  setOpenSheet,
  sortOption,
}: DashboardTableProps) => {
  const { category, toggleSortField, setEditNote } = useNoteStore();
  const { titleLabel, subTitleLabel } = useNoteLabels(category);
  const { getTextColorForHex } = useColor();

  const deleteMutation = useDeleteNoteMutation();

  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading || isFetchingNextPage || !hasNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  const handleDelete = async () => {
    if (deleteNum !== 0) {
      try {
        await deleteMutation.mutateAsync(deleteNum);
      } catch (err) {
        console.error(err);
      } finally {
        setDeleteNum(0);
      }
    }
  };

  // 항상 data가 있을 때만 hasContent를 평가
  const hasContent =
    !!data?.pages?.[0]?.content?.length &&
    data?.pages?.[0]?.content?.length > 0;

  return (
    <>
      <CustomAlert
        title="선택한 데이터를 삭제하시겠습니까?"
        desc="데이터 삭제 후에는 복구가 불가능합니다."
        action="삭제하기"
        open={alertOpen}
        setOpen={setAlertOpen}
        onAction={handleDelete}
      />
      <div className="flex flex-col overflow-auto h-[calc(100vh-150px)]">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-color-none">
              <TableHead>
                <Button
                  className="w-full"
                  variant="ghost"
                  onClick={() => toggleSortField('title')}>
                  {titleLabel}
                  {sortOption.field === 'title'
                    ? sortOption.order === 'asc'
                      ? '▲'
                      : '▼'
                    : '▼'}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  className="w-full"
                  variant="ghost"
                  onClick={() => toggleSortField('subTitle')}>
                  {subTitleLabel}
                  {sortOption.field === 'subTitle'
                    ? sortOption.order === 'asc'
                      ? '▲'
                      : '▼'
                    : '▼'}
                </Button>
              </TableHead>
              <TableHead className="text-center">TAG</TableHead>
              <TableHead>
                <Button
                  className="w-full"
                  variant="ghost"
                  onClick={() => toggleSortField('createdAt')}>
                  DATE
                  {sortOption.field === 'createdAt'
                    ? sortOption.order === 'asc'
                      ? '▲'
                      : '▼'
                    : '▼'}
                </Button>
              </TableHead>
              <TableHead className="text-center">DELETE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <Loader />
                </TableCell>
              </TableRow>
            ) : hasContent && data ? (
              data!.pages.flatMap((page, pageIndex) =>
                page.content.map((item, itemIndex) => (
                  <TableRow
                    key={`${pageIndex}-${item.id}-${itemIndex}`}
                    ref={
                      pageIndex === data!.pages.length - 1 &&
                      itemIndex === page.content.length - 1
                        ? lastItemRef
                        : undefined
                    }
                    onClick={() => {
                      setOpenSheet(true);
                      setEditNote(item);
                    }}
                    className="hover:shadow cursor-pointer duration-300 hover:scale-105 text-center">
                    <TableCell className="max-w-[200px] truncate">
                      {item.title}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {item.subTitle || '-'}
                    </TableCell>
                    <TableCell className="max-w-[120px] truncate">
                      <div className="flex justify-center">
                        {item.tag != null ? (
                          <span
                            style={{
                              background: item.tag.color,
                              color: getTextColorForHex(item.tag.color),
                            }}
                            className="px-2 py-1 truncate rounded-sm border-accent w-full">
                            {item.tag.title}
                          </span>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatRelativeDate(item.createdAt)}</TableCell>
                    <TableCell className="text-center">
                      <DeleteBtn
                        onClick={(e) => {
                          e.stopPropagation();
                          setAlertOpen(true);
                          setDeleteNum(item.id);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )),
              )
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <EmptyState message="데이터를 추가해주세요." />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
