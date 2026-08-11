import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useDayjs } from '@/hooks/useDayjs.hook';
import { DeleteBtn } from '@/components/custom/Btn';
import { useNoteStore } from './note.store';
import { getColorUtils } from '@/utils/getColorUtils.util';
import { useDeleteNoteMutation } from './useView.mutation';
import { CustomAlert } from '@/components/custom/customAlert';
import { useAlert } from '@/hooks/useAlert';
import { NoteResponse } from '../quick_edit/note.types';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/custom/Empty';

export interface ViewTableProps {
  isLoading: boolean;
  deleteNum: number;
  setDeleteNum: React.Dispatch<React.SetStateAction<number>>;
  content: NoteResponse[] | undefined;
  alertOpen: boolean;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenDetail: (note: NoteResponse) => void;
  categoryId: number | null;
  setCategoryId: (id: number | null) => void;
  tagId: number | null;
  setTagId: (id: number | null) => void;
}
export const ViewTable = ({
  deleteNum,
  setDeleteNum,
  content,
  alertOpen,
  setAlertOpen,
  onOpenDetail,
  setTagId,
}: ViewTableProps) => {
  const { toggleSortField, sortOption } = useNoteStore();
  const deleteMutation = useDeleteNoteMutation();
  const { getTextColorForHex } = getColorUtils();
  const { alertMessage } = useAlert();
  const { t } = useTranslation();
  const { formatRelativeDate } = useDayjs();

  const handleDelete = async () => {
    if (deleteNum !== 0) {
      deleteMutation.mutate(deleteNum, {
        onSuccess: () => {
          alertMessage(t('view.submit.delete'));
        },
      });
    }
  };

  return (
    <>
      <CustomAlert
        title={t('view.alert.title')}
        desc={t('view.alert.desc')}
        action={t('view.alert.action')}
        open={alertOpen}
        setOpen={setAlertOpen}
        onAction={handleDelete}
      />
      <div className="flex flex-col">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-color-none">
              <TableHead>
                <Button
                  className="w-full"
                  variant="ghost"
                  onClick={() => toggleSortField('title')}>
                  {t('view.title')}{' '}
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
                  {t('view.subtitle')}{' '}
                  {sortOption.field === 'subTitle'
                    ? sortOption.order === 'asc'
                      ? '▲'
                      : '▼'
                    : '▼'}
                </Button>
              </TableHead>
              <TableHead className="text-center md:table-cell hidden">
                {t('item.category')}
              </TableHead>
              <TableHead className="text-center md:table-cell hidden">
                <Button onClick={() => setTagId(0)} variant="ghost">
                  {t('view.tags')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  className="w-full"
                  variant="ghost"
                  onClick={() => toggleSortField('createdAt')}>
                  {t('view.date')}{' '}
                  {sortOption.field === 'createdAt'
                    ? sortOption.order === 'asc'
                      ? '▲'
                      : '▼'
                    : '▼'}
                </Button>
              </TableHead>
              <TableHead className="text-center">{t('delete')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!content || content.length === 0 ? (
              <TableRow className="w-full">
                <TableCell colSpan={7}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            ) : (
              content.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => {
                    onOpenDetail(item);
                  }}
                  className="hover:shadow cursor-pointer duration-300 hover:-translate-y-0.5 text-center">
                  <TableCell className="max-w-[200px] truncate">
                    {item.title}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {item.subTitle || '-'}
                  </TableCell>
                  <TableCell className="max-w-[120px] truncate md:table-cell hidden">
                    <div className="flex justify-center">
                      {item.category ? (
                        <span
                          style={{
                            background: item.category.color,
                            color: getTextColorForHex(item.category.color),
                          }}
                          className="px-2 py-1 truncate rounded-sm border-accent w-full">
                          {item.category.title}
                        </span>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className=" gap-1 md:flex hidden justify-center items-center">
                    {item.tags?.length ? (
                      <>
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            role="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTagId(tag.id);
                            }}
                            key={tag.id}
                            className="flex max-w-20 items-center truncate rounded-full border border-neutral-300 bg-brand-primary-subtle px-3 py-1 text-sm text-info dark:border-neutral-700">
                            # {tag.name}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            +{item.tags.length - 3} more
                            {/* TODO: edit  */}
                          </span>
                        )}
                      </>
                    ) : (
                      '-'
                    )}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
