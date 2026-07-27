import { useEffect } from 'react';
import { CustomCard } from '@/components/custom/customCard';
import { PageContent, PageLayout } from '@/features/layout';
import { ViewFormField } from '../view/ViewForm.container';
import { useNoteStore } from '../view/note.store';
import { useViewForm } from '../view/useViewForm.hook';

const AddPage = () => {
  const resetEditNote = useNoteStore((s) => s.resetEditNote);
  const viewForm = useViewForm();

  useEffect(() => {
    return () => {
      resetEditNote();
    };
  }, [resetEditNote]);

  return (
    <PageLayout>
      <PageContent width="wide">
        <CustomCard content={<ViewFormField viewForm={viewForm} />} />
      </PageContent>
    </PageLayout>
  );
};

export default AddPage;
