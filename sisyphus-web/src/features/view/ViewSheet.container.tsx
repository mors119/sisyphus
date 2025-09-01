import { useRef, useState } from 'react';
import { CloseBtn, DeleteBtn, EditBtn } from '@/components/custom/Btn';
import { useNoteStore } from './note.store';
import { ViewDetailSection } from './ViewDetailSection.presenter';
import { ViewFormField } from './ViewForm.container';
import { useClickAway } from 'react-use';

interface ViewSheetProps {
  openSheet: boolean;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteNum: React.Dispatch<React.SetStateAction<number>>;
}

export const ViewSheet = ({
  openSheet,
  setAlertOpen,
  setDeleteNum,
}: ViewSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isEdit, setIsEdit] = useState(false);
  const { editNote, setEditNote } = useNoteStore();

  // QUERY
  // const { data, error } = useNoteQuery(openNum);

  useClickAway(sheetRef, () => {
    setEditNote({ ...editNote, id: 0 });
    setIsEdit(false);
  });

  if (!editNote.id || !openSheet) return null;

  return (
    <div
      ref={sheetRef}
      className="w-full h-full p-6 overflow-auto bg-white dark:bg-black dark:border border-gray-600 shadow-lg rounded-lg space-y-6 relative">
      <CloseBtn
        className="absolute right-5"
        onClick={() => {
          setEditNote({ ...editNote, id: 0 });
          setIsEdit(false);
        }}
      />
      {!isEdit ? (
        <>
          <ViewDetailSection />
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
          <ViewFormField key={editNote.id} />
        </div>
      )}
    </div>
  );
};
