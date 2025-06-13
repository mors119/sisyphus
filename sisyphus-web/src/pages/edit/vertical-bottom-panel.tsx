import { CustomCard } from '@/components/custom/custom-card';
import { NoteFormField } from '../../components/note-form';
import { useNoteStore } from '@/stores/note-store';

export const VerticalBottomPanel = () => {
  const data = useNoteStore().editNote;

  return (
    <CustomCard
      className="h-full"
      title={data && data.id !== 0 ? 'EDIT' : 'ADD'}
      content={<NoteFormField data={data} />}
    />
  );
};
