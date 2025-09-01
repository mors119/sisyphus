import { useAlert } from '@/hooks/useAlert';
import { useTranslation } from 'react-i18next';
import { useDeleteNoteMutation } from './useView.mutation';
import { getColorUtils } from '@/utils/getColorUtils.util';
import { useDayjs } from '@/hooks/useDayjs.hook';
import { ViewTableProps } from './ViewTable.container';
import { CustomAlert } from '@/components/custom/customAlert';
import { EmptyState } from '@/components/custom/Empty';
import { useNoteStore } from './note.store';
import { ImageCard } from '../image/ImageCard.component';

export const ViewCardList = ({
  deleteNum,
  content,
  alertOpen,
  setAlertOpen,
  setOpenSheet,
  setTagId,
}: Pick<
  ViewTableProps,
  | 'deleteNum'
  | 'setDeleteNum'
  | 'content'
  | 'alertOpen'
  | 'setAlertOpen'
  | 'setOpenSheet'
  | 'categoryId'
  | 'setCategoryId'
  | 'tagId'
  | 'setTagId'
>) => {
  const { t } = useTranslation();
  const { alertMessage } = useAlert();
  const deleteMutation = useDeleteNoteMutation();
  const { getTextColorForHex } = getColorUtils();
  const { formatRelativeDate } = useDayjs();
  const { setEditNote } = useNoteStore();

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {(!content || content.length === 0) && (
          <div className="col-span-full">
            <EmptyState />
          </div>
        )}

        {content?.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setEditNote(item);
              setOpenSheet(true);
            }}
            className="cursor-pointer group rounded-xl shadow hover:shadow-xl transition border overflow-hidden bg-white dark:bg-neutral-900">
            {/* 이미지 영역 */}
            <ImageCard item={item.image && item.image[0]} />

            {/* 내용 영역 */}
            <div className="p-4 flex flex-col gap-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {item.subTitle || '-'}
                </p>
              </div>

              {/* 태그 */}
              <div className="flex flex-wrap gap-1">
                {item.tags &&
                  item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTagId(tag.id);
                      }}
                      className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-800/40 text-blue-800 dark:text-blue-100 rounded-full border">
                      # {tag.name}
                    </span>
                  ))}
                {item.tags && item.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>

              {/* 푸터 정보 */}
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>{formatRelativeDate(item.createdAt)}</span>
                {item.category && (
                  <span
                    className="px-2 py-0.5 rounded"
                    style={{
                      background: item.category.color,
                      color: getTextColorForHex(item.category.color),
                    }}>
                    {item.category.title}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
