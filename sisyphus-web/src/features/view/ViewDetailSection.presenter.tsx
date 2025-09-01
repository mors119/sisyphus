import { useDayjs } from '@/hooks/useDayjs.hook';
import { useNoteStore } from './note.store';
import { getColorUtils } from '@/utils/getColorUtils.util';
import { useTranslation } from 'react-i18next';
import { ImageCard } from '../image/ImageCard.component';

export const ViewDetailSection = () => {
  const { editNote: data } = useNoteStore();
  const { getTextColorForHex } = getColorUtils();
  const { formatDate } = useDayjs();
  const { t } = useTranslation();

  const image = data.image?.[0];

  return (
    <div className="space-y-4">
      {/* 카테고리 */}
      {data.category && (
        <span
          className="inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: data.category.color,
            color: getTextColorForHex(data.category.color),
          }}>
          {data.category.title}
        </span>
      )}
      {/* 이미지 영역 */}
      {image && (
        <div className="w-full aspect-[4/3] max-w-80 bg-gray-100 dark:bg-neutral-800 overflow-hidden rounded-lg">
          <ImageCard item={image} />
        </div>
      )}

      {/* 제목 & 부제 */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {data.title}
        </h1>
        {data.subTitle && (
          <p className="text-base text-muted-foreground">{data.subTitle}</p>
        )}
      </div>

      <hr />

      {/* 설명 */}
      <div>
        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
          {data.description || t('view.desc_msg')}
        </p>
      </div>

      <hr />

      {/* 태그 */}
      <div className="flex flex-wrap gap-1">
        {data.tags?.map((tag) => (
          <span
            key={tag.id}
            className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-800/40 dark:text-blue-200">
            # {tag.name}
          </span>
        ))}
      </div>

      {/* 작성일 */}
      <div className="text-xs text-right text-gray-400 dark:text-gray-500">
        {t('view.date')}: {formatDate(data.createdAt)}
      </div>
    </div>
  );
};
