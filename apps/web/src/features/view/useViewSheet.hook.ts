import { useCallback, useState } from 'react';
import { NoteResponse } from '../quick_edit/note.types';
import { useNoteStore } from './note.store';

export type ViewSheetMode = 'closed' | 'detail' | 'edit';

export const useViewSheet = () => {
  const { editNote, setEditNote, resetEditNote } = useNoteStore();
  const [mode, setMode] = useState<ViewSheetMode>('closed');

  const openDetail = useCallback(
    (note: NoteResponse) => {
      setEditNote(note);
      setMode('detail');
    },
    [setEditNote],
  );

  const openEdit = useCallback(() => {
    setMode('edit');
  }, []);

  const close = useCallback(() => {
    setMode('closed');
    resetEditNote();
  }, [resetEditNote]);

  const isOpen = mode !== 'closed';

  return {
    mode,
    isOpen,
    editNote,
    openDetail,
    openEdit,
    close,
  };
};
