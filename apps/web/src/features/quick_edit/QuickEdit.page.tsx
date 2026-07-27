import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useState } from 'react';
import {
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  DndContext,
  DragOverlay,
  DragStartEvent,
  pointerWithin,
} from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { FileOutput, FolderOutput } from 'lucide-react';
import { getColorUtils } from '@/utils/getColorUtils.util';
import { isCategoryDrag, isNoteDrag, useDndStore } from './editDnd.store';
import { useNoteStore } from '../view/note.store';
import { HorizontalPanels } from './components/horizontalPanels.component';
import { NoteResponse } from './note.types';
import { CustomCard } from '@/components/custom/customCard';
import { ViewFormField } from '../view/ViewForm.container';
import { CategorySummary } from '../category/category.types';
import { useViewForm } from '../view/useViewForm.hook';
import { responseToForm } from './quickEdit.util';

const QuickEditPage = () => {
  const [verticalSizes, setVerticalSizes] = useState<number[]>(() => {
    const saved = localStorage.getItem('vertical-sizes');
    return saved ? JSON.parse(saved) : [50, 50];
  });

  const handleLayoutChange = (sizes: number[]) => {
    setVerticalSizes(sizes);
    localStorage.setItem('vertical-sizes', JSON.stringify(sizes));
  };

  const viewForm = useViewForm();
  const { onSubmit } = viewForm;
  const { getTextColorForHex } = getColorUtils();
  const { setEditNote, editNote, resetEditNote } = useNoteStore();

  const activeDrag = useDndStore((state) => state.activeDrag);
  const startCategoryDrag = useDndStore((state) => state.startCategoryDrag);
  const startNoteDrag = useDndStore((state) => state.startNoteDrag);
  const activeDone = useDndStore((state) => state.activeDone);

  const activeCategory = isCategoryDrag(activeDrag) ? activeDrag.category : null;
  const activeSubmit = isNoteDrag(activeDrag);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    activeDone();

    if (active.data.current?.type === 'category' && active.data.current) {
      const data = active.data.current as CategorySummary;
      startCategoryDrag(data);
    }

    if (active.data.current?.type === 'note' && active.data.current) {
      const data = active.data.current as NoteResponse;
      setEditNote(data);
      startNoteDrag();
    }
  };

  const handleDragCancel = () => {
    resetEditNote();
    activeDone();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    if (active.data.current?.type === 'category' && over.id === 'note-form') {
      const draggedCategory = active.data.current;

      if (!draggedCategory) return;
      setEditNote({
        ...editNote,
        category: {
          id: draggedCategory.id,
          title: draggedCategory.title,
          color: draggedCategory.color,
        },
      });
    }

    if (
      active.data.current?.type === 'note' &&
      over.data.current?.type === 'category-dropzone'
    ) {
      const categoryData = { ...over.data.current };

      if (!categoryData?.id) {
        console.warn('over.data.current가 유효하지 않습니다.');
        return;
      }

      const nextNote: NoteResponse = {
        ...editNote,
        category: {
          id: categoryData.id,
          title: categoryData.title,
          color: categoryData.color,
        },
      };

      if (activeSubmit) {
        setEditNote({
          id: 0,
          title: '',
          subTitle: '',
          description: '',
          tags: [],
          createdAt: '',
          category: { id: 0, title: '', color: '' },
          image: [],
        });

        onSubmit(responseToForm(nextNote));
      }
    }
    activeDone();
  };

  return (
    <section className="h-full 2xl:px-20 xl:px-16 lg:px-12 lg:py-8 md:px-4 md:py-4 sm:px-2 sm:py-2">
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}>
        <ResizablePanelGroup
          direction="vertical"
          className="h-full w-full"
          onLayout={handleLayoutChange}>
          <ResizablePanel defaultSize={verticalSizes[0]} minSize={0}>
            <HorizontalPanels />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={verticalSizes[1]} minSize={0}>
            <CustomCard
              className="h-full"
              content={<ViewFormField viewForm={viewForm} />}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
        <DragOverlay zIndex={999}>
          {activeCategory && !activeSubmit && (
            <div
              className={cn(
                'w-32 flex-col items-center justify-center rounded-md border border-brand-primary px-3 py-2 font-bold text-white shadow-lg',
              )}
              style={{
                backgroundColor: activeCategory.color,
                color: getTextColorForHex(activeCategory.color),
              }}>
              <FolderOutput
                size={100}
                className="text-yellow-600"
                style={{
                  color: getTextColorForHex(activeCategory.color),
                }}
              />
              <div className="flex items-center justify-center">
                <span className="text-md truncate font-bold">
                  {activeCategory.title}
                </span>
              </div>
            </div>
          )}

          {activeSubmit && !activeCategory && (
            <div className="w-32 px-3 py-2 rounded-md bg-white text-black font-bold border-gray-500 shadow-2xl">
              <FileOutput size={100} className="text-gray-500 shrink-0" />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </section>
  );
};

export default QuickEditPage;
