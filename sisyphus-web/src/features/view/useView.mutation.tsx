import { useMutation } from '@tanstack/react-query';
import { createNote, deleteNote, updateNote } from './view.api';
import { invalidateQuery } from '@/lib/react-query';
import { NoteForm } from '../quick_edit/note.types';

export const useCreateNoteMutation = () => {
  return useMutation({
    mutationFn: (data: NoteForm) => createNote(data),
  });
};

// 노트 삭제
export const useDeleteNoteMutation = () => {
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      // 성공 시 자동 리패칭
      invalidateQuery(['notes']);
    },
  });
};

// 노트 업데이트
export const useUpdateNoteMutation = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: NoteForm }) =>
      updateNote({ id, data }),
    onSuccess: () => {
      invalidateQuery(['notes']); // 전체 노트 리스트 새로고침
    },
    onError: (error) => {
      console.error('노트 업데이트 실패:', error);
    },
  });
};
