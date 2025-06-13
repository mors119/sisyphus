import { useEffect, useRef, useState } from 'react';

import { NoteDetailSection } from '../../pages/dashboard/note-detail-section';

import { NoteFormField } from '../../components/note-form';
import { useNoteStore } from '@/stores/note-store';

import {
  CloseBtn,
  DeleteBtn,
  EditBtn,
} from '@/components/custom/custom-button';

interface DashboardSheetProps {
  openSheet: boolean;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteNum: React.Dispatch<React.SetStateAction<number>>;
}

export const DashboardSheet = ({
  openSheet,
  setAlertOpen,
  setDeleteNum,
}: DashboardSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isEdit, setIsEdit] = useState(false);
  const { editNote, setEditNote } = useNoteStore();

  // QUERY
  // const { data, error } = useNoteQuery(openNum);

  useEffect(() => {
    // ref 영역 바깥부분 클릭 시 sheet 닫기
    const handleClickOutside = (e: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        setEditNote({ ...editNote, id: 0 });
      }
    };
    if (openSheet) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // 이벤트 초기화
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openSheet, editNote, setEditNote]);

  if (!editNote.id || !openSheet) return null;

  return (
    <div
      ref={sheetRef}
      className="w-full h-full p-6 bg-white shadow-lg rounded-lg space-y-6 relative">
      <CloseBtn
        tip={false}
        className="absolute right-5"
        onClick={() => {
          setEditNote({ ...editNote, id: 0 });
          setIsEdit(false);
        }}
      />
      {!isEdit ? (
        <>
          <NoteDetailSection />

          <div className="flex flex-col justify-center items-end gap-2">
            <div className="flex gap-2">
              <EditBtn onClick={() => setIsEdit(true)} />
              <DeleteBtn
                onClick={(e) => {
                  e.stopPropagation();
                  setAlertOpen(true);
                  setDeleteNum(editNote.id);
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="pt-10">
          <NoteFormField key={editNote.id} />
        </div>
      )}
    </div>
  );
};
