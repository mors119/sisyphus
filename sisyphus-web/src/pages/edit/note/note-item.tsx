import { useDraggable } from '@dnd-kit/core';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNoteStore } from '@/stores/note-store';
import { formatRelativeDate } from '@/utils/format-date';
import { NoteResponse } from '@/types/note';

export const NoteItem = ({
  item,
  refCallback,
}: {
  item: NoteResponse;
  refCallback?: (el: HTMLElement | null) => void;
}) => {
  const { setEditNote } = useNoteStore();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `note-${item.id}`,
    data: {
      type: 'note',
      ...item,
    },
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    touchAction: 'none',
  };

  return (
    <div
      key={item.id}
      ref={(el) => {
        setNodeRef(el);
        if (refCallback) refCallback(el);
      }}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'flex-col justify-center hover:shadow-2xl items-center w-32 gap-2 rounded-xl h-full border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:scale-105 cursor-pointer',
      )}
      onClick={() => {
        setEditNote(item);
      }}>
      <FileText size={100} className="text-gray-500 shrink-0" />
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="block w-full truncate text-md text-center font-medium">
            {item.title}
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {formatRelativeDate(item.createdAt)}
        </TooltipContent>
      </Tooltip>
      {/* TODO: delete 버튼과 alertMessage */}
    </div>
  );
};
