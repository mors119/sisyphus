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
import { useDndStore } from './editDnd.store';
import { useNoteStore } from '../view/note.store';
import { HorizontalPanels } from './components/horizontalPanels.component';
import { NoteResponse } from './note.types';
import { CustomCard } from '@/components/custom/customCard';
import { ViewFormField } from '../view/ViewForm.container';
import { CategorySummary } from '../category/category.types';
import { useViewForm } from '../view/useViewForm.hook';
import { responseToForm } from './quickEdit.util';

const QuickEditPage = () => {
  /**
   * localstorage에 'vertical-size' 있으면 가져오기
   * 없으면, 초기값: 50 대 50
   */
  const [verticalSizes, setVerticalSizes] = useState<number[]>(() => {
    const saved = localStorage.getItem('vertical-sizes');
    return saved ? JSON.parse(saved) : [50, 50]; // 초기 로딩 시 localStorage에서 화면 비율 불러오기
  });
  /**
   * Vertical Layout size 변경
   * @param sizes 2개의 숫자 배열
   */
  const handleLayoutChange = (sizes: number[]) => {
    setVerticalSizes(sizes);
    localStorage.setItem('vertical-sizes', JSON.stringify(sizes)); // 화면 비율 적용하기
  };
  const { onSubmit } = useViewForm();
  const { getTextColorForHex } = getColorUtils(); // 색상에 따라 글자색 바꾸기
  const { setEditNote, editNote, done } = useNoteStore(); // note 관련

  const {
    activeCategory,
    setActiveCategory,
    activeSubmit,
    setActiveSubmit,
    activeDone,
  } = useDndStore(); // dnd-kit 관련

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      }, // 100ms 이상 누르고, 5px 이상 이동해야 dnd 활성화
    }),
  );

  // drag 시작 시 이벤트
  const handleDragStart = ({ active }: DragStartEvent) => {
    activeDone(); // active 값 비우기

    // 현재 값이 있고 타입이 category일 경우
    if (active.data.current?.type === 'category' && active.data.current) {
      const data = active.data.current as CategorySummary;
      console.log('(1)', data);
      setActiveCategory(data); // active set에 CategoryAndLevel 타입의 값 넣기 (1)
    }

    if (active.data.current?.type === 'note' && active.data.current) {
      const data = active.data.current as NoteResponse; // note 정보를 noteResponse 타입으로 [1]
      console.log('[1]', data);
      setEditNote(data); // edit note에 값 넣기
      setActiveSubmit(true); // active Submit 활성화
    }
  };

  // drag가 cancel 될 시
  const handleDragCancel = () => {
    done(); // note 비우기 ?????? TODO: check optional
    activeDone(); // active 값 비우기
  };

  // active가 over 영역에 도달 시
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event; // event 찾기
    if (!over || active.id === over.id) return; // 영역에 도달하지 않거나 다른 요소면 return
    console.log('type', active.data.current?.type);
    // active된 타입이 category이고 over된 id가 note form일 경우
    if (active.data.current?.type === 'category' && over.id === 'note-form') {
      const draggedCategory = active.data.current; // (2)
      console.log('(2)', draggedCategory);
      if (!draggedCategory) return;
      setEditNote({
        ...editNote,
        category: {
          id: draggedCategory.id,
          title: draggedCategory.title,
          color: draggedCategory.color,
        },
      }); // (3)
    }

    // active된 타입이 note고 도착한 영역이 category-form일 경우
    if (
      active.data.current?.type === 'note' &&
      over.data.current?.type === 'category-dropzone'
    ) {
      // 한 줄에서 구조분해하지 말고 안전하게 복사 !!! 구조 분해하면 복사가 안됨.
      const categoryData = { ...over.data.current };
      console.log('[2]', categoryData);
      // categoryData에 id가 없을 경우 return
      if (!categoryData?.id) {
        console.warn('over.data.current가 유효하지 않습니다.');
        return;
      }

      // editNote에 값 over 영역 category 값 넣기
      const nextNote: NoteResponse = {
        ...editNote,
        category: {
          id: categoryData.id,
          title: categoryData.title,
          color: categoryData.color,
        },
      };

      // setEditNote(nextNote);

      if (activeSubmit) {
        setEditNote({
          id: 0,
          title: '',
          subTitle: '',
          description: '',
          tags: [],
          createdAt: '',
          category: { id: 0, title: '', color: '' },
        });

        onSubmit(responseToForm(nextNote));
      }
    }
    activeDone(); // 전체 종료 후 active 값 비우기
  };

  return (
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
          <CustomCard className="h-full" content={<ViewFormField />} />
        </ResizablePanel>
      </ResizablePanelGroup>
      <DragOverlay zIndex={999}>
        {activeCategory && !activeSubmit && (
          <div
            className={cn(
              'w-32 px-3 py-2 rounded-md shadow-lg flex-col justify-center items-center text-white font-bold border border-blue-200',
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
            {activeSubmit}
          </div>
        )}
        {activeCategory && <span>{activeCategory.title}</span>}
        {activeSubmit && <span>{activeSubmit}</span>}
      </DragOverlay>
    </DndContext>
  );
};

export default QuickEditPage;
