import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNoteSchema } from './note.schema';
import type { NoteRequest } from './note.schema';
import { createNote } from './note.api';
import { useTranslation } from 'react-i18next';
import { useMessageStore } from '../message.store';

function getSelectedWordFromQuery(): string {
  const url = new URL(window.location.href);
  return url.searchParams.get('selectedWord')?.trim() ?? '';
}

export const useNoteHook = () => {
  const noteSchema = useNoteSchema();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NoteRequest>({
    resolver: zodResolver(noteSchema),
  });

  const { setMsg } = useMessageStore();

  const createNoteMutation = useMutation({
    mutationFn: (req: NoteRequest) => createNote(req),
    onSuccess: () => {
      chrome.storage.local.remove('selectedWord');
      setMsg(t('main.note.success'));
      reset();
    },
    onError: (err) => {
      console.error('server error:', err);
      setMsg(t('main.note.false'));
    },
  });

  useEffect(() => {
    chrome.storage.local.get<{ selectedWord?: string }>(
      'selectedWord',
      (res) => {
        if (res.selectedWord) {
          setValue('title', res.selectedWord);
        }
      },
    );
  }, [setValue]);

  const onSubmit = (data: NoteRequest) => createNoteMutation.mutate(data);

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting: createNoteMutation.isPending || isSubmitting,
    setValue,
  };
};
