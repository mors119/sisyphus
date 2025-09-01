import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { normalizeNoteToForm } from '@/utils/convertType.util';
import { invalidateQuery, removeQuery } from '@/lib/react-query';
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
import { updateImage, uploadImage } from '../image/image.api';
import { ImageResponse } from '../image/image.type';
import { EMPTY_FORM } from './view.constants';

export const useViewForm = () => {
  const fileRef = useRef<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<ImageResponse[] | undefined>(
    undefined,
  );
  const [imageId, setImageId] = useState<number | undefined>(undefined);

  const { editNote, done } = useNoteStore();
  const { alertMessage } = useAlert();
  const { activeDone, activeSubmit } = useDndStore();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  // url 변경 시 editNote 초기화
  // const { pathname } = useLocation();
  // const prevPathRef = useRef<string>('');

  // useEffect(() => {
  //   prevPathRef.current = pathname;
  //   if (prevPathRef.current !== pathname) {
  //     done(); // 초기화
  //     prevPathRef.current = pathname; // 최신 경로 저장
  //   }
  // }, [pathname]);

  /* ---------- default values ---------- */
  const defaultValues = EMPTY_FORM;

  /* ---------- react-hook-form ---------- */
  const form = useForm<NoteForm>({
    resolver: zodResolver(noteSchema),
    defaultValues,
  });

  /* ---------- edit / create 판단 ---------- */
  const isEdit = !!editNote && (editNote.id > 0 || !!editNote.category?.id);

  /* ---------- edit 모드일 때 폼 값 세팅 ---------- */
  useEffect(() => {
    if (isEdit && !activeSubmit) {
      form.reset(normalizeNoteToForm(editNote));
      setImageInfo(editNote.image);

      const firstImageId = editNote.image?.[0]?.id;
      setImageId(firstImageId);
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
        if (imageInfo) {
          await updateNote({ id: editNote.id, data: values });
        } else {
          if (previewUrl && fileRef.current) {
            const updateImg = await updateImage(fileRef.current, imageId);

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
      await invalidateQuery(['categoryNullNotes']);
      // await invalidateQuery(['notes']);
      await removeQuery(['notes']);
    } catch (err) {
      console.error(err);
      alertMessage(t('view.submit.error'));
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
