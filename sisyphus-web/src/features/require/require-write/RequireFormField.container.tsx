import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAlert } from '@/hooks/useAlert';
import {
  useCreateMutation,
  useUpdateRequireMutation,
} from '@/features/require/useRequireQuery.query';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { RequireCate, RequireForm } from '../require.types';

import { useTranslation } from 'react-i18next';
import { requireSchema } from '../require.schema';

interface Props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type?: RequireCate;
  isEdit?: boolean;
  setIsEdit?: React.Dispatch<React.SetStateAction<boolean>>;
  isValidId?: number;
  initial?: Partial<Pick<RequireForm, 'title' | 'description' | 'requireType'>>;
}

export const RequireFormField = ({
  setIsOpen,
  type,
  isEdit = false,
  isValidId,
  initial,
  setIsEdit,
}: Props) => {
  const { alertMessage } = useAlert();
  const { t } = useTranslation();

  const schema = useMemo(() => requireSchema(t), [t]);
  // react-hook-form (zod 검증)
  const form = useForm<RequireForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      // 생성 모드 기본값
      requireType: type ?? initial?.requireType,
      title: initial?.title ?? '',
      description: initial?.description ?? '',
    },
  });

  // 편집 모드에서 외부 initial이 바뀌면 폼에 반영
  useEffect(() => {
    if (!isEdit) return;
    form.reset({
      requireType: initial?.requireType ?? type,
      title: initial?.title ?? '',
      description: initial?.description ?? '',
    });
  }, [
    isEdit,
    initial?.requireType,
    initial?.title,
    initial?.description,
    type,
    form,
  ]);

  // 생성/업데이트 뮤테이션
  const createMutation = useCreateMutation();
  const updateMutation = useUpdateRequireMutation({
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  // 공통 제출 핸들러 → 모드에 따라 분기
  const onSubmit = async (values: RequireForm) => {
    try {
      if (isEdit) {
        if (!isValidId) {
          alertMessage(t('require.form.editAlert'));
          return;
        }
        await updateMutation.mutateAsync({ id: isValidId, ...values });
        alertMessage(t('require.form.editAlert2'));
      } else {
        await createMutation.mutateAsync(values);
        alertMessage(t('require.form.createAlert'));
        form.reset({
          requireType: type,
          title: '',
          description: '',
        });
      }
      setIsOpen(false);
    } catch (err) {
      alertMessage(
        isEdit ? t('require.form.editFalse') : t('require.form.createFalse'),
        {
          description: t('require.form.waitMsg') + `\n${String(err)}`,
        },
      );
    }
  };

  const isBusy = createMutation.isPending || updateMutation.isPending;
  const primaryLabel = isEdit
    ? t(updateMutation.isPending ? 'require.form.editing' : 'require.form.edit')
    : t(
        createMutation.isPending
          ? 'require.form.creating'
          : 'require.form.create',
      );

  return (
    <Form {...form} key={isEdit ? `edit-${isValidId ?? 'na'}` : 'new'}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'w-full rounded-md shadow-sm h-full space-y-4 duration-300 p-4 border max-h-full block mb-2',
        )}>
        {/* TITLE */}
        <FormField
          control={form.control}
          name="title" // 역할: 제목 (string)
          render={({ field }) => (
            <FormItem>
              <FormLabel>TITLE</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('require.form.exPlace')}
                  {...field}
                  disabled={isBusy}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DESCRIPTION */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DESCRIPTION</FormLabel>
              <FormControl>
                <Textarea
                  className="w-full max-h-80"
                  placeholder={t('require.form.exPlace2')}
                  disabled={isBusy}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full justify-end gap-2">
          <Button
            className={cn(!isEdit && 'w-full')}
            type="submit"
            disabled={isBusy}>
            {primaryLabel}
          </Button>
          {isEdit && (
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsEdit && setIsEdit(false)}>
              {t('require.form.cancel')}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
