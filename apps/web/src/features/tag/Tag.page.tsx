import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageContent, PageHeader, PageLayout } from '@/features/layout';
import { Button } from '@/components/ui/button';
import { DeleteBtn, QuestionBtn } from '@/components/custom/Btn';
import { cn } from '@/lib/utils';
import { HashTagInput } from './HashTagInput.container';
import { useFetchTags } from './useTag.query';
import {
  useCreateTagMutation,
  useDeleteTagMutation,
  useUpdateTagMutation,
} from './useTag.mutation';
import { TagTemp } from './tag.type';
import { invalidateQuery } from '@/lib/react-query';
import { useAlert } from '@/hooks/useAlert';

const TagPage = () => {
  const createMutation = useCreateTagMutation();
  const { alertMessage } = useAlert();
  const { data: tags = [], isLoading } = useFetchTags();
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempTags.length === 0) return;

    const payload = tempTags.map((tag) => ({ name: tag.name }));
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

    deleteMutation.mutate(delTags, {
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
    <PageLayout className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t('item.tag')}
        description={t('tags.page.add')}
      />

      <PageContent width="medium" className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col gap-8">
          <section className="flex min-h-0 flex-1 flex-col gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-heading-3 font-semibold text-foreground">
                {t('tags.page.save')}
              </h2>
              <QuestionBtn message={t('qusBtn.tag')} location="right" />
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>

            {isLoading ? (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-16 animate-pulse rounded-full bg-muted"
                  />
                ))}
              </div>
            ) : (
              <form
                className="flex min-h-0 flex-1 flex-col gap-4"
                onSubmit={deleteSubmit}>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <div className="flex flex-wrap content-start gap-2">
                    {tags.map((tag) =>
                      editingTagId === tag.id ? (
                        <input
                          key={tag.id}
                          className="w-32 rounded-full border border-input px-2 py-1 text-sm"
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
                              setDelTags(
                                delTags.filter((item) => item !== tag.id),
                              );
                            }
                          }}
                          onDoubleClick={() => startEdit(tag.id, tag.name)}
                          className={cn(
                            'flex cursor-pointer items-center justify-center rounded-full px-3 py-1 text-sm',
                            delTags.includes(tag.id)
                              ? 'bg-danger-subtle text-danger'
                              : 'bg-brand-primary-subtle text-info',
                          )}>
                          # {tag.name}
                        </span>
                      ),
                    )}
                    {tags.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        {t('tags.page.empty')}
                      </p>
                    )}
                  </div>
                </div>

                <DeleteBtn
                  type="submit"
                  disabled={delTags.length === 0}
                  className="ml-0 h-10 w-full justify-center rounded-control"
                  size={18}
                />
              </form>
            )}
          </section>

          <section className="shrink-0 space-y-4 border-t border-border pt-8">
            <h2 className="text-heading-3 font-semibold text-foreground">
              {t('tags.page.add')}
            </h2>

            <form onSubmit={onSubmit} className="space-y-4">
              <HashTagInput value={tempTags} onChange={setTempTags} />
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || tempTags.length === 0}>
                {t('save')}
              </Button>
            </form>
          </section>
        </div>
      </PageContent>
    </PageLayout>
  );
};

export default TagPage;
