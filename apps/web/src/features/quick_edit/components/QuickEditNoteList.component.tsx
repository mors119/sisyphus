import { useCallback } from 'react';

import { LoadingState } from '@/components/custom/Loader';
import { EmptyState } from '@/components/custom/Empty';
import { cn } from '@/lib/utils';
import { useDayjs } from '@/hooks/useDayjs.hook';
import { getColorUtils } from '@/utils/getColorUtils.util';
import { useNoteStore } from '@/features/view/note.store';
import { useNotesInfiniteQuery } from '@/features/view/useView.query';
import { NoteResponse } from '../note.types';

export const QuickEditNoteList = () => {
  const { formatRelativeDate } = useDayjs();
  const { getTextColorForHex } = getColorUtils();
  const { editNote, setEditNote } = useNoteStore();
  const sortOption = useNoteStore((state) => state.sortOption);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useNotesInfiniteQuery({
      sortOption,
      size: 20,
    });

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      if (
        !hasNextPage ||
        isFetchingNextPage ||
        target.scrollHeight - target.scrollTop - target.clientHeight > 120
      ) {
        return;
      }
      fetchNextPage();
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  const notes = data?.pages.flatMap((page) => page.content) ?? [];

  const listClassName = 'h-full min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1';

  if (isLoading) {
    return (
      <div className={listClassName}>
        <LoadingState compact />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className={listClassName}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={listClassName} onScroll={handleScroll}>
      <ul className="space-y-2">
        {notes.map((item: NoteResponse) => {
          const isSelected = editNote.id === item.id;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setEditNote(item)}
                className={cn(
                  'w-full rounded-[var(--radius-role-control)] border px-4 py-3 text-left transition-colors',
                  isSelected
                    ? 'border-brand-primary bg-brand-primary-subtle'
                    : 'border-border bg-card hover:border-brand-primary',
                )}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {item.title}
                    </p>
                    {item.subTitle ? (
                      <p className="truncate text-sm text-muted-foreground">
                        {item.subTitle}
                      </p>
                    ) : null}
                  </div>
                  {item.category?.title ? (
                    <span
                      className="shrink-0 rounded px-2 py-0.5 text-xs font-medium"
                      style={{
                        background: item.category.color,
                        color: getTextColorForHex(item.category.color),
                      }}>
                      {item.category.title}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatRelativeDate(item.createdAt)}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
      {isFetchingNextPage && <LoadingState compact />}
    </div>
  );
};
