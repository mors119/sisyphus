import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { PageContent, PageHeader, PageLayout } from '@/features/layout';
import { cn } from '@/lib/utils';
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
    <PageLayout className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t('item.note')}
        actions={
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <IdCard size={15} />
              {t('item.card')}
            </span>
            <Switch checked={mode} onCheckedChange={setMode} />
            <span className="flex items-center gap-1">
              <Table size={15} />
              {t('item.table')}
            </span>
          </div>
        }
      />

      <PageContent width="wide" className="relative flex min-h-0 flex-1 flex-col">
        {isLoading ? (
          <LoadingState compact />
        ) : isError ? (
          <ErrorState />
        ) : content.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="px-2 text-muted-foreground"
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.delete('mode');
                    next.delete('type');
                    next.delete('id');
                    next.delete('q');
                    setSearchParams(next);
                    setCategoryId(null);
                    setTagId(null);
                    setTit(null);
                  }}>
                  {t('item.view')}
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
            </div>

            <div
              className="min-h-0 flex-1 overflow-y-auto"
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

              {!isSearchMode && <div ref={loadMoreRef} className="h-8" />}
              {!isSearchMode && infiniteQ.isFetchingNextPage && (
                <LoadingState compact />
              )}
            </div>
          </div>
        )}

        <div
          className={cn(
            'absolute left-0 top-0 z-40 flex h-full w-full translate-x-full justify-end transition-transform duration-[var(--motion-standard)]',
            viewSheet.isOpen && 'translate-x-0',
          )}>
          <div className="h-full w-full max-w-[var(--content-medium)]">
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
      </PageContent>
    </PageLayout>
  );
};

export default ViewPage;
