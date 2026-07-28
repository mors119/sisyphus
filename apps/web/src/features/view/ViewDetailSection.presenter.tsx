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
    <div className="min-h-0 flex-1 overflow-y-auto p-6">
      <article className="mx-auto flex w-full flex-col gap-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {data.category ? (
              <span
                className="inline-flex rounded-[var(--radius-role-pill)] px-3 py-1 text-xs font-semibold"
                style={{
                  background: data.category.color,
                  color: getTextColorForHex(data.category.color),
                }}>
                {data.category.title}
              </span>
            ) : (
              <span />
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-[length:var(--font-h1)] font-semibold leading-[var(--line-h1)] text-foreground">
              {data.title}
            </h1>
            {data.subTitle && (
              <p className="text-[length:var(--font-small)] leading-[var(--line-small)] text-muted-foreground">
                {data.subTitle}
              </p>
            )}
          </div>
        </header>

        {image && (
          <figure className="max-w-md overflow-hidden rounded-[var(--radius-role-card)] border border-border">
            <ImageCard item={image} />
          </figure>
        )}

        <section className="space-y-4">
          <p className="whitespace-pre-wrap text-[length:var(--font-body)] leading-[var(--line-body)] text-foreground">
            {data.description || t('view.desc_msg')}
          </p>

          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex rounded-[var(--radius-role-pill)] bg-brand-primary-subtle px-2.5 py-1 text-[length:var(--font-caption)] font-medium leading-[var(--line-caption)] text-info">
                  # {tag.name}
                </span>
              ))}
            </div>
          )}
          <time className="text-[length:var(--font-caption)] leading-[var(--line-caption)] text-muted-foreground">
            {t('view.date')}: {formatDate(data.createdAt)}
          </time>
        </section>
      </article>
    </div>
  );
};
