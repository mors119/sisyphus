import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

import { CustomCard } from '@/components/custom/custom-card';
import { useState } from 'react';
import { TagField } from './tag/tag-field';
import { NoteField } from './note/note-field';
import { Button } from '@/components/ui/button';

import { useNoteStore } from '@/stores/note-store';
import { Category } from '@/types/note';
import { useTagStore } from '@/stores/tag-store';
import { Plus } from 'lucide-react';

export const HorizontalPanels = () => {
  const [horizontalSizes, setHorizontalSizes] = useState<number[]>(() => {
    // 초기 로딩 시 localStorage에서 불러오기
    const saved = localStorage.getItem('horizontal-sizes');
    return saved ? JSON.parse(saved) : [50, 50];
  });

  const { category, setCategory } = useNoteStore();
  const [cateOpen, setCateOpen] = useState(false);
  const { setEditingTagId, editingTagId } = useTagStore();

  const handleLayoutChange = (sizes: number[]) => {
    setHorizontalSizes(sizes);
    localStorage.setItem('horizontal-sizes', JSON.stringify(sizes));
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full"
      onLayout={handleLayoutChange}>
      <ResizablePanel defaultSize={horizontalSizes[0]}>
        <CustomCard
          className="flex-1 h-full"
          title={
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => {
                  setCateOpen(!cateOpen);
                }}>
                {category === 'ALL' ? 'NEW' : category} {cateOpen ? '▲' : '▼'}
              </Button>
              {cateOpen && (
                <ul className="absolute left-0 top-full mt-1 w-32 border bg-white z-10 shadow-md">
                  {[
                    { label: '전체', value: 'ALL' },
                    { label: '단어', value: 'WORD' },
                    { label: '노트', value: 'NOTE' },
                    { label: '일정', value: 'TODO' },
                  ].map(({ label, value }) => (
                    <li key={value}>
                      <Button
                        variant="ghost"
                        className="w-full text-left px-2 py-1"
                        onClick={() => {
                          setCategory(value as Category);
                          setCateOpen(false);
                        }}>
                        {label}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          }
          content={<NoteField />}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={horizontalSizes[1]}>
        <CustomCard
          className="h-full"
          title={
            <Button
              className="flex items-center group"
              variant="ghost"
              onClick={() => {
                if (editingTagId !== 0) {
                  setEditingTagId(0);
                } else {
                  setEditingTagId(null);
                }
              }}>
              <span className="peer">Tag</span>
              <Plus size={10} className="peer-hover:rotate-180 duration-300" />
            </Button>
          }
          content={<TagField />}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
