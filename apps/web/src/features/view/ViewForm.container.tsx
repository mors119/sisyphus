import { cn } from '@/lib/utils';

import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { CleanBtn } from '@/components/custom/Btn';
import { HashTagInput } from '../tag/HashTagInput.container';
import { CategorySelectField } from '../category/CategorySelectField.form';
import { useCategoriesQuery } from '../category/category.query';
import { ViewFormController } from './useViewForm.hook';
import { useTranslation } from 'react-i18next';
import { ImageUploaderForm } from '../image/ImageUploader.container';

interface ViewFormFieldProps {
  viewForm: ViewFormController;
  variant?: 'default' | 'compact';
}

export const ViewFormField = ({
  viewForm,
  variant = 'default',
}: ViewFormFieldProps) => {
  const {
    form,
    onSubmit,
    isLoading,
    isEdit,
    reset,
    setPreviewUrl,
    previewUrl,
    fileRef,
    imageInfo,
    setImageInfo,
  } = viewForm;
  const { t } = useTranslation();
  const { data: categoryArray = [] } = useCategoriesQuery();

  const isCompact = variant === 'compact';

  return (
    <div
      className={cn(
        'relative w-full dark:bg-black',
        isCompact
          ? 'min-h-0 rounded-[var(--radius-role-card)] border border-border bg-card p-3 md:p-4'
          : 'flex min-h-0 flex-1 flex-col rounded-[var(--radius-role-card)] border border-border bg-card',
      )}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            'flex w-full flex-col',
            isCompact ? 'space-y-1.5' : 'min-h-0 flex-1',
          )}>
          {isCompact ? (
            <div className="flex flex-wrap items-start gap-3 sm:grid sm:grid-cols-[auto_minmax(10rem,1fr)_auto]">
              <ImageUploaderForm
                fileRef={fileRef}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                imageInfo={imageInfo}
                setImageInfo={setImageInfo}
              />

              <div className="flex min-w-0 flex-col gap-1 self-start">
                <span className="text-sm font-medium leading-none">
                  {t('category.page.category')}
                </span>
                <CategorySelectField
                  control={form.control}
                  name="categoryId"
                  categoryArray={categoryArray}
                />
              </div>

              <CleanBtn onClick={() => reset()} />
            </div>
          ) : (
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <ImageUploaderForm
                  fileRef={fileRef}
                  previewUrl={previewUrl}
                  setPreviewUrl={setPreviewUrl}
                  imageInfo={imageInfo}
                  setImageInfo={setImageInfo}
                  variant="panel"
                />

                <div className="flex items-center gap-3 sm:ml-auto">
                  <CategorySelectField
                    control={form.control}
                    name="categoryId"
                    categoryArray={categoryArray}
                  />
                  <CleanBtn onClick={() => reset()} />
                </div>
              </div>

              <div className="space-y-4">{renderFields()}</div>
            </div>
          )}

          {isCompact && <div className="space-y-1.5">{renderFields()}</div>}

          <div
            className={cn(
              isCompact
                ? undefined
                : 'flex shrink-0 justify-end border-t border-border p-6 pt-4',
            )}>
            <Button
              className={cn('w-full', !isCompact && 'sm:w-auto')}
              type="submit"
              disabled={isLoading}>
              {t(isEdit ? 'edit' : 'add')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );

  function renderFields() {
    return (
      <>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className={cn(isCompact && 'gap-1')}>
              <FormLabel>{t('view.title')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('view.title2')}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subTitle"
          render={({ field }) => (
            <FormItem className={cn(isCompact && 'gap-1')}>
              <FormLabel>{t('view.subtitle')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('view.subtitle2')}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className={cn(isCompact && 'gap-1')}>
              <FormLabel>{t('view.desc')}</FormLabel>
              <FormControl>
                <Textarea
                  className={cn(
                    'w-full',
                    isCompact ? 'min-h-12 max-h-28' : 'max-h-80',
                  )}
                  placeholder={t('view.desc2')}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className={cn(isCompact && 'gap-1')}>
              <FormLabel>{t('view.tags')}</FormLabel>
              <FormControl>
                <HashTagInput value={field.value} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </>
    );
  }
};
