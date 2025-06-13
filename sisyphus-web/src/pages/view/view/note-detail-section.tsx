import { useColor } from '@/hooks/use-color';
import { useNoteStore } from '@/stores/note-store';
import { formatDate } from '@/utils/format-date';

export const NoteDetailSection = () => {
  const { editNote: data } = useNoteStore();
  const { getTextColorForHex } = useColor();

  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
          {data.category}
        </span>
        {data.tag && (
          <span
            className="inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold "
            style={{
              background: data.tag.color,
              color: getTextColorForHex(data.tag.color),
            }}>
            {data.tag.title}
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
        <h3 className="text-sm font-medium text-muted-foreground mb-1">설명</h3>
        <p className="text-sm whitespace-pre-wrap">
          {data.description || '설명이 없습니다.'}
        </p>
      </div>
      <hr />

      <div className="text-xs text-gray-400 text-end">
        작성일: {formatDate(data.createdAt)}
      </div>
    </>
  );
};
