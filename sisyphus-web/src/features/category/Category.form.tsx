import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HexColorPicker } from 'react-colorful';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from '@/features/category/category.mutation';
import { useAlert } from '@/hooks/useAlert';
import { useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCategoryStore } from './category.store';
import { CategoryForm } from './category.types';
import { useCategorySchema } from './category.schema';
import { useTranslation } from 'react-i18next';

export const CategoryFormUnified = () => {
  const { alertMessage } = useAlert();
  const { onDone, editingCategoryId, categoryData } = useCategoryStore();
  // const categoryData = useCategoryStore().categoryData;
  const isEdit = categoryData?.id !== null && editingCategoryId !== 0;
  const categorySchema = useCategorySchema();
  const { t } = useTranslation();

  const form = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: categoryData ?? {
      title: '',
      color: '#ffcd49',
    },
  });

  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation(categoryData.id ?? -1);

  const onSubmit = async (values: CategoryForm) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync(values);
      } else {
        await createMutation.mutateAsync(values);
      }
      onDone();
      if (!isEdit) form.reset({ title: '', color: '#ffcd49' });
    } catch (err) {
      void err;
      alertMessage(t('category.msg.submit.error'));
    }
  };
  useEffect(() => {
    if (categoryData) {
      form.reset(categoryData);
    }
  }, [categoryData?.id]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 items-start h-full pt-2 w-full">
        {/* 제목 */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t('category.form.title')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('category.form.tit_placeholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 색상 */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t('category.form.color')}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className=" p-2 border-2 rounded-md"
                    asChild>
                    <span
                      style={{ backgroundColor: field.value }}
                      className="w-full h-8"></span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <HexColorPicker
                    color={field.value}
                    onChange={field.onChange}
                    className="w-40 h-40"
                  />
                  <Input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                    className="mt-2 text-sm text-black"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 w-full">
          <Button
            type="submit"
            className="w-1/2"
            disabled={createMutation.isPending || updateMutation?.isPending}>
            {t(isEdit ? 'edit' : 'add')}
          </Button>
          <Button
            className="w-1/2"
            type="button"
            variant="outline"
            onClick={onDone}>
            {t('cancel')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
