import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { PageContent, PageLayout } from '@/features/layout';
import { cn } from '@/lib/utils';
import { CustomCard } from '@/components/custom/customCard';
import { LoadingState } from '@/components/custom/Loader';
import { ErrorState } from '@/components/custom/Error';
import { EmptyState } from '@/components/custom/Empty';
import { Switch } from '@/components/ui/switch';
import { IdCard, Table } from 'lucide-react';

import { useNoteStore } from './note.store';
import { ViewTable } from './ViewTable.container';
import { ViewSheet } from './ViewSheet.container';
import { ViewCardList } from './VeiwCardList.container';
import { CategorySelector } from './CategorySelector';
import { CategorySummary } from '../category/category.types';
import { SEARCH_ITEM } from '../layout/header/search.constants';

import { useNotesInfiniteQuery, useNotesQuery } from './useView.query';
import { Button } from '@/components/ui/button';
import { useLocalStorageBoolean } from './view.hook';
import { useViewSheet } from './useViewSheet.hook';
import { NoteResponse } from '../quick_edit/note.types';

const ViewPage = () => {
  const [mode, setMode] = useLocalStorageBoolean('mode', false);
  const location = useLocation();
  const navigate = useNavigate();
  const openedFromNavigationRef = useRef(false);

  const [cateOpen, setCateOpen] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [deleteNum, setDeleteNum] = useState<number>(0);

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [tagId, setTagId] = useState<number | null>(null);
  const [tit, setTit] = useState<string | null>(null);

  const { sortOption } = useNoteStore();
  const viewSheet = useViewSheet();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const resetEditNote = useNoteStore((s) => s.resetEditNote);

  useEffect(() => {
    // ViewPage를 떠날 때(언마운트) 초기화
    return () => {
      resetEditNote();
    };
  }, [resetEditNote]);

  useEffect(() => {
    if (openedFromNavigationRef.current) return;

    const state = location.state as { openNote?: NoteResponse } | null;
    if (!state?.openNote?.id) return;

    openedFromNavigationRef.current = true;
    viewSheet.openDetail(state.openNote);
    navigate(
      { pathname: location.pathname, search: location.search },
      { replace: true, state: null },
    );
  }, [location, navigate, viewSheet]);

  // URL params
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const title = searchParams.get('title');
  const isSearchMode = searchParams.get('mode') === 'search';

  // 스크롤 root
  const listRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 1) URL search params -> 필터 state 동기화
  useEffect(() => {
    // NOTE: 검색 모드가 아닐 때도 URL 필터가 있을 수 있으니 그대로 유지
    if (!(type && id) && !title) return;

    setCategoryId(null);
    setTagId(null);
    setTit(null);

    switch (type) {
      case SEARCH_ITEM.CATE:
        setCategoryId(parseInt(id ?? '0', 10) || null);
        break;
      case SEARCH_ITEM.TAG:
        setTagId(parseInt(id ?? '0', 10) || null);
        break;
      case SEARCH_ITEM.NOTE:
        setTit(title ?? null);
        break;
    }

    // 검색 모드로 들어오면 스크롤을 맨 위로(UX)
    listRef.current?.scrollTo({ top: 0 });
  }, [type, id, title]);

  // 2-A) 검색 모드: useNotesQuery (page=0만)
  const searchQ = useNotesQuery(0, sortOption, categoryId, tagId, tit);

  // 2-B) 일반 모드: infinite query
  const infiniteQ = useNotesInfiniteQuery({
    sortOption,
    categoryId,
    tagId,
    tit,
    size: 12,
    enabled: !isSearchMode,
  });

  // 3) content를 모드별로 통일
  const content = useMemo(() => {
    if (isSearchMode) {
      return searchQ.data?.content ?? [];
    }
    return infiniteQ.data?.pages.flatMap((p) => p.content) ?? [];
  }, [isSearchMode, searchQ.data, infiniteQ.data]);

  // 4) 로딩/에러도 모드별로 통일
  const isLoading = isSearchMode ? searchQ.isLoading : infiniteQ.isLoading;
  const isError = isSearchMode ? !!searchQ.error : !!infiniteQ.error;

  // 5) 무한 스크롤 트리거는 "일반 모드"일 때만
  useEffect(() => {
    if (isSearchMode) return;

    const root = listRef.current;
    const target = loadMoreRef.current;
    if (!root || !target) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          infiniteQ.hasNextPage &&
          !infiniteQ.isFetchingNextPage
        ) {
          infiniteQ.fetchNextPage();
        }
      },
      { root, rootMargin: '200px' },
    );

    io.observe(target);
    return () => io.disconnect();
  }, [
    isSearchMode,
    infiniteQ.hasNextPage,
    infiniteQ.isFetchingNextPage,
    infiniteQ.fetchNextPage,
  ]);

  return (
    <PageLayout className="gap-4 py-4 sm:py-6">
      <PageContent width="wide">
        <CustomCard
          content={
            <>
              {isLoading ? (
                <LoadingState compact />
              ) : isError ? (
                <ErrorState />
              ) : content.length === 0 ? (
                <EmptyState />
              ) : (
              <div>
                <div className="flex justify-between">
                  <div className="flex justify-center items-center pl-2">
                    <Button
                      className="hover:bg-transparent bg-transparent dark:text-white/80 border-transparent shadow-none text-black/80 hover:text-black dark:hover:text-white"
                      onClick={() => {
                        const next = new URLSearchParams(searchParams);
                        next.delete('mode');
                        next.delete('type');
                        next.delete('id');
                        next.delete('q'); // or title
                        setSearchParams(next);
                        setCategoryId(null);
                        setTagId(null);
                        setTit(null);
                      }}>
                      전체보기
                    </Button>

                    <CategorySelector
                      categoryId={categoryId}
                      open={cateOpen}
                      setCategoryId={setCategoryId}
                      setOpen={setCateOpen}
                      data={Array.from(
                        new Map(
                          content
                            .map((item) => item.category)
                            .filter((c): c is CategorySummary => !!c)
                            .map((c) => [c.id, c]),
                        ).values(),
                      )}
                    />
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className="flex gap-1 items-center text-xs">
                      <IdCard size={15} />
                      {t('item.card')}
                    </span>
                    <Switch checked={mode} onCheckedChange={setMode} />
                    <span className="flex gap-1 items-center text-xs">
                      <Table size={15} />
                      {t('item.table')}
                    </span>
                  </div>
                </div>

                <div
                  className="h-[calc(100vh-150px)] overflow-hidden flex flex-col overflow-y-auto"
                  ref={listRef}>
                  {mode ? (
                    <ViewTable
                      isLoading={isLoading}
                      deleteNum={deleteNum}
                      setDeleteNum={setDeleteNum}
                      content={content}
                      alertOpen={alertOpen}
                      setAlertOpen={setAlertOpen}
                      onOpenDetail={viewSheet.openDetail}
                      categoryId={categoryId}
                      setCategoryId={setCategoryId}
                      tagId={tagId}
                      setTagId={setTagId}
                    />
                  ) : (
                    <ViewCardList
                      deleteNum={deleteNum}
                      setDeleteNum={setDeleteNum}
                      content={content}
                      alertOpen={alertOpen}
                      setAlertOpen={setAlertOpen}
                      onOpenDetail={viewSheet.openDetail}
                      categoryId={categoryId}
                      setCategoryId={setCategoryId}
                      tagId={tagId}
                      setTagId={setTagId}
                    />
                  )}

                  {/* sentinel은 일반 모드에서만 의미가 있음 */}
                  {!isSearchMode && <div ref={loadMoreRef} className="h-8" />}
                  {!isSearchMode && infiniteQ.isFetchingNextPage && (
                    <LoadingState compact />
                  )}
                </div>
              </div>
            )}

            <div
              className={cn(
                'absolute left-0 top-0 w-full h-full z-40 translate-x-full duration-300 flex justify-end',
                viewSheet.isOpen && 'translate-x-0',
              )}>
              <div className="max-w-3/4 h-full w-full">
                <ViewSheet
                  mode={viewSheet.mode}
                  onClose={viewSheet.close}
                  onEdit={viewSheet.openEdit}
                  setAlertOpen={setAlertOpen}
                  setDeleteNum={setDeleteNum}
                  noteId={viewSheet.editNote.id}
                />
              </div>
            </div>
          </>
        }
        />
      </PageContent>
    </PageLayout>
  );
};

export default ViewPage;
