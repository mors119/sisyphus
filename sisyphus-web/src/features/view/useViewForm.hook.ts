// src/features/view/useNoteForm.ts
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { normalizeNoteToForm } from '@/utils/convertType.util';
import { invalidateQuery } from '@/lib/react-query';
import { useAlert } from '@/hooks/useAlert';
import { useNoteStore } from './note.store';
import {
  useCreateNoteMutation,
  useUpdateNoteMutation,
} from './useView.mutation';
import { noteSchema } from './view.schema';

import { useDndStore } from '../quick_edit/editDnd.store';
import { NoteForm } from '../quick_edit/note.types';
import { useTranslation } from 'react-i18next';

export const useViewForm = () => {
  const { editNote, done } = useNoteStore();
  const { alertMessage } = useAlert();
  const { activeDone, activeSubmit } = useDndStore();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  /* ---------- default values ---------- */
  const defaultValues: NoteForm = {
    title: '',
    subTitle: '',
    description: '',
    tags: [],
    categoryId: undefined,
    file: undefined as unknown as File,
  };

  /* ---------- react-hook-form ---------- */
  const form = useForm<NoteForm>({
    resolver: zodResolver(noteSchema),
    defaultValues,
  });

  /* ---------- edit / create 판단 ---------- */
  const isEdit = editNote.id !== 0 || !!editNote.category?.id;

  /* ---------- edit 모드일 때 폼 값 세팅 ---------- */
  useEffect(() => {
    if (isEdit && !activeSubmit) {
      form.reset(normalizeNoteToForm(editNote));
    }
  }, [isEdit, editNote, form, activeSubmit]);

  /* ---------- 뮤테이션 준비 ---------- */
  const { mutateAsync: updateNote } = useUpdateNoteMutation();
  const { mutateAsync: createNote } = useCreateNoteMutation();

  /* ---------- 제출 ---------- */
  const onSubmit = async (values: NoteForm) => {
    setIsLoading(true);

    try {
      if (isEdit) {
        await updateNote({ id: editNote.id, data: values });
        alertMessage(t('view.submit.update'));
      } else {
        await createNote(values);
        alertMessage(t('view.submit.create'));
      }

      /* 캐시 무효화 & refetch */
      await invalidateQuery(['categoryNullNotes']);
    } catch (err) {
      console.error(err);
      alertMessage(t('view.submit.delete'));
    } finally {
      setTimeout(() => {
        done();
        activeDone();
        setIsLoading(false);
        form.reset(defaultValues);
      }, 300);
    }
  };

  return {
    form,
    isLoading,
    isEdit,
    onSubmit,
    reset: () => form.reset(defaultValues),
  };
};
