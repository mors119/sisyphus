import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import { HorizontalPanels } from './horizontal-panels';
import { VerticalBottomPanel } from './vertical-bottom-panel';
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
import { useDndStore } from '@/stores/dnd-store';
import { TagAndLevel } from '@/types/tag';
import { useNoteStore } from '@/stores/note-store';
import { NoteResponse } from '@/types/note';
import { cn } from '@/lib/utils';
import { useColor } from '@/hooks/use-color';
import { FileOutput, FolderOutput } from 'lucide-react';

const EditPage = () => {
  const [verticalSizes, setVerticalSizes] = useState<number[]>(() => {
    const saved = localStorage.getItem('vertical-sizes');
    return saved ? JSON.parse(saved) : [50, 50]; // 초기 로딩 시 localStorage에서 화면 비율 불러오기
  });

  const handleLayoutChange = (sizes: number[]) => {
    setVerticalSizes(sizes);
    localStorage.setItem('vertical-sizes', JSON.stringify(sizes)); // 화면 비율 적용하기
  };

  const { getTextColorForHex } = useColor(); // 색상에 따라 글자색 바꾸기
  const { setEditNote, editNote, done } = useNoteStore(); // note 관련
  const { activeTag, setActiveTag, activeSubmit, setActiveSubmit, activeDone } =
    useDndStore(); // dnd-kit 관련

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      }, // 100ms 이상 누르고, 5px 이상 이동해야 dnd 활성화
    }),
  );

  // TODO 1: activeTag시에 dropzone활성화
  // TODO 2: activeSubmit시에 dropzone tag 전체로 크게 활성화

  // drag 시작 시 이벤트
  const handleDragStart = ({ active }: DragStartEvent) => {
    activeDone(); // active 값 비우기

    // 현재 값이 있고 타입이 tag일 경우
    if (active.data.current?.type === 'tag' && active.data.current) {
      const data = active.data.current as TagAndLevel;
      console.log('(1)', data);
      setActiveTag(data); // active set에 TagAndLevel 타입의 값 넣기 (1)
    }

    if (active.data.current?.type === 'note' && active.data.current) {
      const data = active.data.current as NoteResponse; // note 정보를 noteResponse 타입으로 [1]
      console.log('[1]', data);
      setEditNote(data); // edit note에 값 넣기
      setActiveSubmit(data.title); // active Submit 활성화
    }
  };

  // drag가 cancel 될 시
  const handleDragCancel = () => {
    activeDone(); // active 값 비우기
    done(); // note 비우기 ?????? TODO: check optional
  };

  // active가 over 영역에 도달 시
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event; // event 찾기
    if (!over || active.id === over.id) return; // 영역에 도달하지 않거나 다른 요소면 return
    console.log('type', active.data.current?.type);
    // active된 타입이 tag이고 over된 id가 note form일 경우
    if (active.data.current?.type === 'tag' && over.id === 'note-form') {
      const draggedTag = active.data.current; // (2)
      console.log('(2)', draggedTag);
      if (!draggedTag) return;
      setEditNote({
        ...editNote,
        tag: {
          id: draggedTag.id,
          title: draggedTag.title,
          color: draggedTag.color,
        },
      }); // (3)
    }

    // active된 타입이 note고 도착한 영역이 tag-form일 경우
    if (
      active.data.current?.type === 'note' &&
      over.data.current?.type === 'tag-dropzone'
    ) {
      // 한 줄에서 구조분해하지 말고 안전하게 복사 !!! 구조 분해하면 복사가 안됨.
      const tagData = { ...over.data.current };
      console.log('[2]', tagData);
      // tagData에 id가 없을 경우 return
      if (!tagData?.id) {
        console.warn('over.data.current가 유효하지 않습니다');
        return;
      }

      // editNote에 값 over 영역 tag 값 넣기
      setEditNote({
        ...editNote,
        tag: {
          id: tagData.id,
          title: tagData.title,
          color: tagData.color,
        },
      });
    }
    // activeDone(); // 전체 종료 후 active 값 비우기
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
          <VerticalBottomPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
      <DragOverlay zIndex={999}>
        {activeTag && !activeSubmit && (
          <div
            className={cn(
              'w-32 px-3 py-2 rounded-md shadow-lg flex-col justify-center items-center text-white font-bold border border-blue-200',
            )}
            style={{
              backgroundColor: activeTag.color,
              color: getTextColorForHex(activeTag.color),
            }}>
            <FolderOutput
              size={100}
              className="text-yellow-600"
              style={{
                color: getTextColorForHex(activeTag.color),
              }}
            />
            <div className="flex items-center justify-center">
              <span className="text-md truncate font-bold">
                {activeTag.title}
              </span>
            </div>
          </div>
        )}

        {activeSubmit && !activeTag && (
          <div className="w-32 px-3 py-2 rounded-md bg-white text-black font-bold border-gray-500 shadow-2xl">
            <FileOutput size={100} className="text-gray-500 shrink-0" />
            {activeSubmit}
          </div>
        )}
        {activeTag && <span>{activeTag.title}</span>}
        {activeSubmit && <span>{activeSubmit}</span>}
      </DragOverlay>
    </DndContext>
  );
};

export default EditPage;
