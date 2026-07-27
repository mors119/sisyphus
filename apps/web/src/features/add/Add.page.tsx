import { CustomCard } from '@/components/custom/customCard';
import { PageContent, PageLayout } from '@/features/layout';
import { ViewFormField } from '../view/ViewForm.container';
import { useNoteStore } from '../view/note.store';
import { useEffect } from 'react';

const AddPage = () => {
  const resetEditNote = useNoteStore((s) => s.resetEditNote);

  useEffect(() => {
    return () => {
      resetEditNote();
    };
  }, [resetEditNote]);

  return (
    <PageLayout>
      <PageContent width="wide">
        <CustomCard content={<ViewFormField />} />
      </PageContent>
    </PageLayout>
  );
};

export default AddPage;
