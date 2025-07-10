import { useDayjs } from '@/hooks/useDayjs.hook';
import { useNoteStore } from './note.store';
import { getColorUtils } from '@/utils/getColorUtils.util';
import { useTranslation } from 'react-i18next';

export const ViewDetailSection = () => {
  const { editNote: data } = useNoteStore();
  const { getTextColorForHex } = getColorUtils();
  const { formatDate } = useDayjs();
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col gap-2">
        {data.category && (
          <span
            className="inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold "
            style={{
              background: data.category.color,
              color: getTextColorForHex(data.category.color),
            }}>
            {data.category.title}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{data.title}</h1>
        {data.subTitle && (
          <p className="text-base text-muted-foreground">{data.subTitle}</p>
        )}
      </div>

      <hr />

      <div>
        <p className="text-sm whitespace-pre-wrap">
          {data.description || t('view.desc_msg')}
        </p>
      </div>
      <hr />
      <div className="gap-1 flex mb-0">
        {data.tags?.map((tag) => (
          <span
            className="inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"
            key={tag.id}>
            # {tag.name}
          </span>
        ))}
      </div>

      <div className="text-xs text-gray-400 text-end">
        {t('view.date')}: {formatDate(data.createdAt)}
      </div>
    </>
  );
};
