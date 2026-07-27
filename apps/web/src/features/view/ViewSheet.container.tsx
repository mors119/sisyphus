import { useRef } from 'react';
import { CloseBtn, DeleteBtn, EditBtn } from '@/components/custom/Btn';
import { ViewDetailSection } from './ViewDetailSection.presenter';
import { ViewFormField } from './ViewForm.container';
import { useClickAway } from 'react-use';
import { ViewSheetMode } from './useViewSheet.hook';
import { useViewForm } from './useViewForm.hook';

interface ViewSheetProps {
  mode: ViewSheetMode;
  onClose: () => void;
  onEdit: () => void;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteNum: React.Dispatch<React.SetStateAction<number>>;
  noteId: number;
}

export const ViewSheet = ({
  mode,
  onClose,
  onEdit,
  setAlertOpen,
  setDeleteNum,
  noteId,
}: ViewSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useClickAway(sheetRef, () => {
    if (mode === 'edit') return;
    onClose();
  });

  if (mode === 'closed') return null;

  return (
    <div
      ref={sheetRef}
      className="w-full h-full p-6 overflow-auto bg-white dark:bg-black dark:border border-gray-600 shadow-lg rounded-lg space-y-6 relative">
      <CloseBtn className="absolute right-5" onClick={onClose} />
      {mode === 'detail' ? (
        <>
          <ViewDetailSection />
          <div className="flex flex-col justify-center items-end gap-2">
            <div className="flex gap-2">
              <EditBtn
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              />
              <DeleteBtn
                onClick={(e) => {
                  e.stopPropagation();
                  setAlertOpen(true);
                  setDeleteNum(noteId);
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <ViewSheetEdit noteId={noteId} />
      )}
    </div>
  );
};

const ViewSheetEdit = ({ noteId }: { noteId: number }) => {
  const viewForm = useViewForm();

  return (
    <div className="pt-10">
      <ViewFormField key={noteId} viewForm={viewForm} />
    </div>
  );
};
