import { useNotesQuery } from '@/features/view/useView.query';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CustomCard } from '@/components/custom/customCard';
import { invalidateQuery } from '@/lib/react-query';
import { useNoteStore } from './note.store';
import { ViewTable } from './ViewTable.container';
import { ViewSheet } from './ViewSheet.container';
import { CustomPagination } from '@/components/custom/customPagination';
import { Loader } from '@/components/custom/Loader';
import { useSearchParams } from 'react-router-dom';
import { ErrorState } from '@/components/custom/Error';
import { SEARCH_ITEM } from '../layout/header/search.constants';
import { ViewCardList } from './VeiwCardList.container';
import { Switch } from '@/components/ui/switch';
import { IdCard, Table } from 'lucide-react';
import { CategorySelector } from './CategorySelector';
import { CategorySummary } from '../category/category.types';
import { useTranslation } from 'react-i18next';

const ViewPage = () => {
  const [mode, setMode] = useState(false);
  const [cateOpen, setCateOpen] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [deleteNum, setDeleteNum] = useState<number>(0);
  const [openSheet, setOpenSheet] = useState(false);

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [tagId, setTagId] = useState<number | null>(null);
  const [tit, setTit] = useState<string | null>(null);
  const { sortOption, editNote } = useNoteStore();
  const [page, setPage] = useState(0);

  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const title = searchParams.get('title');

  const { t } = useTranslation();

  const { data, isLoading, error } = useNotesQuery(
    page,
    sortOption,
    categoryId,
    tagId,
    tit,
  );

  const totalPages = data?.totalPages ?? 1;

  useEffect(() => {
    if (type && id && title) {
      setTagId(null);
      setTit(null);
      setCategoryId(null);

      switch (type) {
        case SEARCH_ITEM.CATE:
          setCategoryId(parseInt(id));

          break;
        case SEARCH_ITEM.TAG:
          setTagId(parseInt(id));

          break;
        case SEARCH_ITEM.NOTE:
          setTit(title);

          break;
      }
    }

    const timeout = setTimeout(() => {
      // 변경된 데이터 부르기
      invalidateQuery([
        'notes',
        page,
        sortOption,
        categoryId,
        tagId,
        type,
        id,
        title,
      ]);
    }, 50); // 약간의 지연

    return () => clearTimeout(timeout);
  }, [sortOption, categoryId, tagId, title, type, id]);

  return (
    <CustomCard
      title={<div className="relative"></div>}
      content={
        <>
          {isLoading ? (
            <Loader />
          ) : !data || error ? (
            <ErrorState />
          ) : (
            <div>
              <div className="mb-2 flex justify-between">
                {/* todo: category 전체 보여주고 없으면 empty state */}
                {/* TODO: category 호출 오류 수정하기 */}
                <CategorySelector
                  categoryId={categoryId}
                  open={cateOpen}
                  setCategoryId={setCategoryId}
                  setOpen={setCateOpen}
                  data={Array.from(
                    new Map(
                      (data.content ?? [])
                        .map((item) => item.category)
                        .filter((c): c is CategorySummary => !!c)
                        .map((c) => [c.id, c]), // key: id, value: category
                    ).values(),
                  )}
                />

                <div className="flex gap-2 items-center">
                  <span className="flex gap-1 items-center text-xs">
                    <Table size={15} />
                    {t('item.table')}
                  </span>
                  <Switch
                    onClick={() => {
                      setMode(!mode);
                    }}
                  />
                  <span className="flex gap-1 items-center text-xs">
                    <IdCard size={15} />
                    {t('item.card')}
                  </span>
                </div>
              </div>

              <div className="h-[calc(100vh-150px)] flex flex-col gap-14">
                {mode ? (
                  <ViewTable
                    isLoading={isLoading}
                    deleteNum={deleteNum}
                    setDeleteNum={setDeleteNum}
                    content={data.content}
                    alertOpen={alertOpen}
                    setAlertOpen={setAlertOpen}
                    setOpenSheet={setOpenSheet}
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                    tagId={tagId}
                    setTagId={setTagId}
                  />
                ) : (
                  <ViewCardList
                    deleteNum={deleteNum}
                    setDeleteNum={setDeleteNum}
                    content={data.content}
                    alertOpen={alertOpen}
                    setAlertOpen={setAlertOpen}
                    setOpenSheet={setOpenSheet}
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                    tagId={tagId}
                    setTagId={setTagId}
                  />
                )}
                <CustomPagination
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                />
              </div>
            </div>
          )}
          {/* ViewSheet */}
          <div
            className={cn(
              'absolute left-0 top-0 w-full h-full z-40 translate-x-full duration-300 flex justify-end',
              editNote.id !== 0 && openSheet && 'translate-x-0',
            )}>
            <div className="w-3/4 h-full">
              <ViewSheet
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

export default ViewPage;
