import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { normalizeNoteToForm } from '@/utils/convertType.util';
import { removeQuery } from '@/lib/react-query';
import { useAlert } from '@/hooks/useAlert';
import { useNoteStore } from './note.store';
import {
  useCreateNoteMutation,
  useUpdateNoteMutation,
} from './useView.mutation';
import { noteSchema } from './view.schema';

import { NoteForm } from '../quick_edit/note.types';
import { useTranslation } from 'react-i18next';
import { updateImage, uploadImage } from '../image/image.api';
import { ImageResponse } from '../image/image.type';
import { EMPTY_FORM } from './view.constants';

export const useViewForm = () => {
  const fileRef = useRef<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageOverride, setImageOverride] = useState<{
    noteId: number;
    value: ImageResponse[] | undefined;
  } | null>(null);

  const { editNote, resetEditNote } = useNoteStore();
  const { alertMessage } = useAlert();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  /* ---------- default values ---------- */
  const defaultValues = EMPTY_FORM;

  /* ---------- react-hook-form ---------- */
  const form = useForm<NoteForm>({
    resolver: zodResolver(noteSchema),
    defaultValues,
  });

  /* ---------- edit / create 판단 ---------- */
  const isEdit = editNote.id > 0;
  const imageInfo =
    imageOverride?.noteId === editNote.id
      ? imageOverride.value
      : isEdit
        ? editNote.image
        : undefined;
  const imageId = editNote.image?.[0]?.id;

  const setImageInfo: React.Dispatch<
    React.SetStateAction<ImageResponse[] | undefined>
  > = useCallback(
    (value) => {
      setImageOverride((current) => {
        const currentValue =
          current?.noteId === editNote.id ? current.value : imageInfo;
        return {
          noteId: editNote.id,
          value:
            typeof value === 'function' ? value(currentValue) : value,
        };
      });
    },
    [editNote.id, imageInfo],
  );

  /* ---------- edit 모드일 때 폼 값 세팅 ---------- */
  useEffect(() => {
    if (isEdit) {
      form.reset(normalizeNoteToForm(editNote));
    }
  }, [isEdit, editNote, form]);

  /* ---------- 뮤테이션 준비 ---------- */
  const { mutateAsync: updateNote } = useUpdateNoteMutation();
  const { mutateAsync: createNote } = useCreateNoteMutation();

  /* ---------- 제출 ---------- */
  const onSubmit = async (values: NoteForm) => {
    setIsLoading(true);

    try {
      if (isEdit) {
        if (imageInfo) {
          await updateNote({ id: editNote.id, data: values });
        } else {
          if (previewUrl && fileRef.current) {
            const updateImg = await updateImage(fileRef.current, imageId ?? 0);

            await updateNote({
              id: editNote.id,
              data: { ...values, imageId: updateImg?.id },
            });
          }

          // TODO: card 형식일 때 무한 스크롤 적용
          // delete ?????
          // await updateNote({ id: editNote.id, data: values });
        }

        alertMessage(t('view.submit.update'));
      } else {
        if (fileRef.current) {
          const uploaded = await uploadImage(fileRef.current); // 응답: { id: number, url: string }
          values.imageId = uploaded.id; // NoteForm에 imageId 삽입
        }
        await createNote(values);
        alertMessage(t('view.submit.create'));
      }

      fileRef.current = null;
      setPreviewUrl(null);

      /* 캐시 무효화 & refetch */
      await removeQuery(['notes']);
    } catch (err) {
      console.error(err);
      alertMessage(t('view.submit.error'));
    } finally {
      setTimeout(() => {
        resetEditNote();
        setIsLoading(false);
        form.reset(defaultValues);
      }, 300);
    }
  };

  return {
    fileRef,
    setPreviewUrl,
    previewUrl,
    form,
    isLoading,
    isEdit,
    onSubmit,
    imageInfo,
    setImageInfo,
    reset: () => form.reset(defaultValues),
  };
};

export type ViewFormController = ReturnType<typeof useViewForm>;
