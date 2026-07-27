import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';

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
import { useDndStore } from '../quick_edit/editDnd.store';
import { useViewForm } from './useViewForm.hook';
import { useTranslation } from 'react-i18next';
import { ImageUploaderForm } from '../image/ImageUploader.container';

export const ViewFormField = () => {
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
  } = useViewForm();
  const { t } = useTranslation();
  const { data: categoryArray = [] } = useCategoriesQuery();
  const { activeSubmit, activeCategory } = useDndStore();

  const { isOver, setNodeRef, active } = useDroppable({
    id: 'note-form',
    data: { type: 'note-form' },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative w-full h-full rounded-lg transition-all duration-300 dark:bg-black',
        isOver
          ? 'border-brand-primary bg-brand-primary-subtle p-4 border-2 border-dashed'
          : 'border-gray-300 bg-white',
      )}>
      {/* DnD 오버레이 */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center pointer-events-none font-bold transition-all duration-300',
          !activeSubmit && activeCategory && active?.id
            ? 'text-info border-4 z-50 border-brand-primary bg-brand-primary-subtle'
            : 'hidden',
          isOver &&
            'z-50 border-4 border-dashed border-brand-accent bg-action-primary text-on-brand-primary shadow-raised',
        )}>
        {isOver ? 'Drop here' : 'Drop category here to apply'}
      </div>

      {/* 폼 UI */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full flex flex-col">
          <div className="flex justify-between gap-3 items-center">
            <ImageUploaderForm
              fileRef={fileRef}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              imageInfo={imageInfo}
              setImageInfo={setImageInfo}
            />
            <div className="flex items-center gap-3 justify-end">
              <CleanBtn onClick={() => reset()} />

              <CategorySelectField
                control={form.control}
                name="categoryId"
                categoryArray={categoryArray}
              />
            </div>
          </div>

          {/* title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
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

          {/* subTitle */}
          <FormField
            control={form.control}
            name="subTitle"
            render={({ field }) => (
              <FormItem>
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

          {/* description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('view.desc')}</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full max-h-80"
                    placeholder={t('view.desc2')}
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* tags */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('view.tags')}</FormLabel>
                <FormControl>
                  <HashTagInput value={field.value} onChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit" disabled={isLoading}>
            {t(isEdit ? 'edit' : 'add')}
          </Button>
        </form>
      </Form>
    </div>
  );
};
