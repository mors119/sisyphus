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
      className="relative flex h-full min-h-0 flex-col border-l border-border bg-background">
      <CloseBtn className="absolute right-4 top-4 z-10" onClick={onClose} />

      {mode === 'detail' ? (
        <>
          <ViewDetailSection />
          <footer className="flex shrink-0 justify-end gap-2 border-t border-border p-6">
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
          </footer>
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
    <div className="flex min-h-0 flex-1 flex-col px-6 pb-6 pt-14">
      <ViewFormField key={noteId} viewForm={viewForm} />
    </div>
  );
};
