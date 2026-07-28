import { DndContext } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';

import { PageContent, PageHeader, PageLayout } from '@/features/layout';
import { Button } from '@/components/ui/button';
import { ViewFormField } from '../view/ViewForm.container';
import { useNoteStore } from '../view/note.store';
import { useViewForm } from '../view/useViewForm.hook';
import { QuickEditNoteList } from './components/QuickEditNoteList.component';

const QuickEditPage = () => {
  const { t } = useTranslation();
  const viewForm = useViewForm();
  const resetEditNote = useNoteStore((state) => state.resetEditNote);

  const handleNewNote = () => {
    resetEditNote();
    viewForm.reset();
    viewForm.setPreviewUrl(null);
    viewForm.setImageInfo(undefined);
  };

  return (
    <DndContext>
      <div className="flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col overflow-hidden">
        <PageLayout className="flex h-full min-h-0 flex-col gap-4 overflow-hidden py-4 md:gap-6 md:py-6">
          <PageHeader
            className="shrink-0"
            title={t('item.quick')}
            description={t('quick.select_note')}
            actions={
              <Button type="button" variant="secondary" onClick={handleNewNote}>
                {t('quick.new')}
              </Button>
            }
          />

          <PageContent
            width="medium"
            className="flex h-0 min-h-0 flex-1 flex-col gap-4 overflow-hidden">
            <section className="flex min-h-0 flex-1 basis-0 flex-col gap-2 overflow-hidden">
              <h2 className="shrink-0 text-heading-3 font-semibold text-foreground">
                {t('quick.notes')}
              </h2>
              <QuickEditNoteList />
            </section>

            <section className="shrink-0 border-t border-border bg-background pt-4">
              <ViewFormField viewForm={viewForm} variant="compact" />
            </section>
          </PageContent>
        </PageLayout>
      </div>
    </DndContext>
  );
};

export default QuickEditPage;
