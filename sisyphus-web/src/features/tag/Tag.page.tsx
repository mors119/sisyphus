import { useEffect, useState } from 'react';
import { HashTagInput } from './HashTagInput.container';
import { useFetchTags } from './useTag.query';
import {
  useCreateTagMutation,
  useDeleteTagMutation,
  useUpdateTagMutation,
} from './useTag.mutation';
import { TagTemp } from './tag.type';
import { useTagStore } from './tag.store';
import { Loader2 } from 'lucide-react';
import { invalidateQuery } from '@/lib/react-query';
import { useAlert } from '@/hooks/useAlert';
import { DeleteBtn } from '@/components/custom/Btn';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const TagPage = () => {
  const createMutation = useCreateTagMutation();
  const { alertMessage } = useAlert();
  const { data: tagsFromDB, isLoading } = useFetchTags();
  const { setTags } = useTagStore();
  const tags = useTagStore((state) => state.tags);
  const [tempTags, setTempTags] = useState<TagTemp[]>([]);
  const deleteMutation = useDeleteTagMutation();
  const [delTags, setDelTags] = useState<number[]>([]);
  const updateMutation = useUpdateTagMutation();
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const { t } = useTranslation();

  const startEdit = (tagId: number, currentName: string) => {
    setEditingTagId(tagId);
    setEditValue(currentName);
  };

  useEffect(() => {
    console.log('DB tags', tagsFromDB);
    if (tagsFromDB) setTags(tagsFromDB);
  }, [tagsFromDB]);

  /** 제출 → tempTags를 TagRequest[] 형태로 변환 후 전송 */
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tempTags.length === 0) return;

    // TagTemp(id, name) → TagRequest(name) 로 변환
    const payload = tempTags.map((t) => ({ name: t.name }));
    createMutation.mutate(payload, {
      onSuccess: () => {
        invalidateQuery(['tags']);
        alertMessage(t('tags.submit.create'));
        setTempTags([]);
      },
    });
  };

  const deleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (delTags.length === 0) return;

    const payload: number[] = delTags;
    deleteMutation.mutate(payload, {
      onSuccess: () => {
        invalidateQuery(['tags']);
        alertMessage(t('tags.submit.delete'));
        setDelTags([]);
      },
    });
  };

  const finishEdit = (tagId: number, original: string) => {
    const trimmed = editValue.trim();
    if (trimmed === '' || trimmed === original) {
      // 내용 동일하거나 빈 값이면 취소
      setEditingTagId(null);
      setEditValue('');
      setDelTags([]);
      return;
    }

    updateMutation.mutate(
      { id: tagId, name: trimmed },
      {
        onSuccess: () => {
          invalidateQuery(['tags']);
          alertMessage(t('tags.submit.update'));
          setEditingTagId(null);
          setEditValue('');
        },
      },
    );
  };
  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      {/* DB 태그 카드 */}
      <section className="bg-white dark:bg-neutral-900 rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          {t('tags.page.save')}
          {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
        </h2>

        {isLoading ? (
          // 스켈레톤
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-6 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"
              />
            ))}
          </div>
        ) : (
          <form className="flex flex-wrap gap-2" onSubmit={deleteSubmit}>
            {tags.map((tag) =>
              editingTagId === tag.id ? (
                <input
                  key={tag.id}
                  className="px-2 py-1 text-sm border rounded-full w-32"
                  value={editValue}
                  autoFocus
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => finishEdit(tag.id, tag.name)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') finishEdit(tag.id, tag.name);
                  }}
                />
              ) : (
                <span
                  key={tag.id}
                  role="button"
                  onClick={() => {
                    if (!delTags.includes(tag.id)) {
                      setDelTags([...delTags, tag.id]);
                    } else {
                      setDelTags(delTags.filter((item) => item !== tag.id));
                    }
                  }}
                  onDoubleClick={() => startEdit(tag.id, tag.name)}
                  className={cn(
                    `px-3 py-1 rounded-full text-sm cursor-pointer flex items-center justify-center`,
                    delTags.includes(tag.id)
                      ? 'bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
                  )}>
                  # {tag.name}
                </span>
              ),
            )}
            {tags.length === 0 && (
              <p className="text-sm text-neutral-500">{t('tags.page.empty')}</p>
            )}

            <DeleteBtn type="submit" />
          </form>
        )}
      </section>

      {/* 입력 카드 */}
      <section className="bg-white dark:bg-neutral-900 rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">{t('tags.page.add')}</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <HashTagInput value={tempTags} onChange={setTempTags} />

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"
            disabled={isLoading || tempTags.length === 0}>
            {t('save')}
          </button>
        </form>
      </section>
    </div>
  );
};

export default TagPage;
