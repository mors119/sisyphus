import { useCategoryNullNotesQuery } from '@/features/view/useView.query';
import { useCallback, useRef } from 'react';
import { Loader } from '@/components/custom/Loader';
import { EmptyState } from '@/components/custom/Empty';
import { NoteItem } from './noteItem.component';

import { AnimatedChildren } from '@/components/animated-children';

export const NoteField = () => {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useCategoryNullNotesQuery();

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

  const isEmpty = data?.pages.every((page) => page.content.length === 0);

  return (
    <div className="flex flex-wrap gap-2">
      {isLoading ? (
        <Loader />
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        data?.pages.flatMap((page, pageIndex) =>
          page.content.map((item, itemIndex) => (
            <AnimatedChildren key={`${item.id}-${itemIndex}`} isOpen={!!item}>
              <NoteItem
                item={item}
                refCallback={
                  pageIndex === data!.pages.length - 1 &&
                  itemIndex === page.content.length - 1
                    ? lastItemRef
                    : undefined
                }
              />
            </AnimatedChildren>
          )),
        )
      )}
    </div>
  );
};
