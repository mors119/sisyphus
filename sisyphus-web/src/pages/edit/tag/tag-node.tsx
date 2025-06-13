import { Folder, FolderMinus, FolderOpen } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';
import { useColor } from '@/hooks/use-color';
import { useDeleteTagMutation } from '@/hooks/use-tag-query';
import { useTagStore } from '@/stores/tag-store';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { TagAndLevel } from '@/types/tag';
import { mergeRefs } from '@/utils/mergeRefs';
import { useMeasure } from 'react-use';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DeleteBtn } from '@/components/custom/custom-button';
import { useDndStore } from '@/stores/dnd-store';

export const TagNode = ({
  tag,
}: {
  tag: TagAndLevel & { isVisible: boolean };
}) => {
  const { mutate: deleteTag } = useDeleteTagMutation();
  const { setTagData, setEditingTagId, toggleCollapse, isCollapsed } =
    useTagStore();
  const { getTextColorForHex } = useColor();
  const [measureRef, bounds] = useMeasure();
  const { activeTag, activeSubmit } = useDndStore();

  const {
    attributes,
    listeners,
    setNodeRef: dragRef,
    transform,
  } = useDraggable({
    id: `tag-${tag.id}`,
    data: {
      type: 'tag',
      ...tag,
    },
  });

  const {
    isOver,
    setNodeRef: dropRef,
    active,
  } = useDroppable({
    id: `form-${tag.id}`,
    data: { type: 'tag-dropzone', ...tag },
  });

  const style = useSpring({
    opacity: tag.isVisible ? 1 : 0,
    height: tag.isVisible ? bounds.height : 0,
    overflow: 'hidden',
    config: { tension: 210, friction: 20 },
  });

  const dndStyle = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    border: isOver ? '2px dashed #3b82f6' : 'none',
    backgroundColor: isOver ? '#e0f2fe' : undefined,
  };

  const hasChildren = tag.childrenId && tag.childrenId.length > 0;
  const collapsed = isCollapsed(tag.id);

  return (
    <animated.div
      style={style}
      className={cn(
        'w-32 hover:scale-105 hover:shadow-2xl relative',
        !tag.isVisible && 'max-w-0',
      )}>
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 font-bold',
          activeSubmit && !activeTag && active?.id
            ? 'text-blue-600 border-4 border-blue-300 bg-blue-50 bg-opacity-50'
            : 'hidden',
          isOver &&
            'z-50 text-white border-4 border-dashed border-blue-600 bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 shadow-xl',
        )}>
        {isOver ? 'Dorp here' : 'Drop zone'}
      </div>
      <div
        ref={mergeRefs(measureRef, dropRef, dragRef)}
        style={dndStyle}
        {...listeners}
        {...attributes}>
        <div
          onDoubleClick={() => {
            setTagData({
              id: tag.id,
              color: tag.color,
              title: tag.title,
              parentId: tag.parentId,
            });
            setEditingTagId(tag.id);
          }}
          className="flex-col items-center justify-center px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-all bg-blue-50 border border-blue-200"
          style={{
            backgroundColor: tag.color,
            color: getTextColorForHex(tag.color),
          }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasChildren) toggleCollapse(tag.id);
                }}>
                {!collapsed && hasChildren ? (
                  <FolderOpen
                    size={100}
                    style={{
                      color: getTextColorForHex(tag.color),
                    }}
                    className="text-yellow-600"
                  />
                ) : hasChildren ? (
                  <Folder
                    size={100}
                    style={{
                      color: getTextColorForHex(tag.color),
                    }}
                    className="text-yellow-600"
                  />
                ) : (
                  <FolderMinus
                    size={100}
                    style={{
                      color: getTextColorForHex(tag.color),
                    }}
                    className="text-yellow-600"
                  />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {tag.title} ({tag.childrenId?.length || 0})
            </TooltipContent>
          </Tooltip>
          <div className="flex items-center justify-center">
            <span className="text-md truncate font-bold">{tag.title}</span>
            <DeleteBtn
              onClick={(e) => {
                e.stopPropagation();
                deleteTag(tag.id);
              }}
            />
          </div>
        </div>
      </div>
    </animated.div>
  );
};
