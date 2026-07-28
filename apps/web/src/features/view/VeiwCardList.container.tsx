import { useAlert } from '@/hooks/useAlert';
import { useTranslation } from 'react-i18next';
import { useDeleteNoteMutation } from './useView.mutation';
import { getColorUtils } from '@/utils/getColorUtils.util';
import { useDayjs } from '@/hooks/useDayjs.hook';
import { ViewTableProps } from './ViewTable.container';
import { CustomAlert } from '@/components/custom/customAlert';
import { EmptyState } from '@/components/custom/Empty';
import { ImageCard } from '../image/ImageCard.component';

export const ViewCardList = ({
  deleteNum,
  content,
  alertOpen,
  setAlertOpen,
  onOpenDetail,
  setTagId,
}: Pick<
  ViewTableProps,
  | 'deleteNum'
  | 'setDeleteNum'
  | 'content'
  | 'alertOpen'
  | 'setAlertOpen'
  | 'onOpenDetail'
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-4 ">
        {(!content || content.length === 0) && (
          <div className="col-span-full">
            <EmptyState />
          </div>
        )}

        {content?.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              onOpenDetail(item);
            }}
            className="group cursor-pointer overflow-hidden rounded-[var(--radius-role-card)] border border-border bg-card transition-colors hover:border-brand-primary">
            {/* 이미지 영역 */}
            <ImageCard item={item.image && item.image[0]} />

            {/* 내용 영역 */}
            <div className="flex flex-col gap-2 p-4">
              <div>
                <h3 className="truncate text-sm font-semibold text-foreground md:text-base">
                  {item.title}
                </h3>
                <p className="truncate text-xs text-muted-foreground md:text-sm">
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
                      className="rounded-full border bg-brand-primary-subtle px-2 py-0.5 text-xs text-info">
                      # {tag.name}
                    </span>
                  ))}
                {item.tags && item.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
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
