import { useDraggable, useDroppable } from '@dnd-kit/core';
import { mergeRefs } from '@/utils/mergeRefs.util';
import { useMeasure } from 'react-use';
import { cn } from '@/lib/utils';
import { DeleteBtn } from '@/components/custom/Btn';
import { useCategoryStore } from './category.store';
import { getColorUtils } from '@/utils/getColorUtils.util';
import { useDeleteCategoryMutation } from './category.mutation';
import { useDndStore } from '../quick_edit/editDnd.store';
import { CustomTooltip } from '@/components/custom/customTooltip';
import { CategorySummary } from './category.types';
import { Folder } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CategoryNode = ({
  category,
  condition,
}: {
  category: CategorySummary;
  condition: boolean;
}) => {
  const { mutate: deleteCategory } = useDeleteCategoryMutation();
  const { setCategoryData, setEditingCategoryId } = useCategoryStore();
  const { getTextColorForHex } = getColorUtils();
  const [measureRef] = useMeasure();
  const { activeSubmit, activeCategory } = useDndStore();
  const { t } = useTranslation();

  const {
    attributes,
    listeners,
    setNodeRef: dragRef,
    transform,
  } = useDraggable({
    id: `category-${category.id}`,
    data: {
      type: 'category',
      ...category,
    },
  });

  const {
    isOver,
    setNodeRef: dropRef,
    active,
  } = useDroppable({
    id: `form-${category.id}`,
    data: { type: 'category-dropzone', ...category },
  });

  const dndStyle = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    border: isOver ? '2px dashed #3b82f6' : 'none',
    backgroundColor: isOver ? '#e0f2fe' : undefined,
  };

  const folderClick = (e: React.MouseEvent) => {
    if (!condition) return;
    e.preventDefault();
    setCategoryData({
      id: category.id,
      color: category.color,
      title: category.title,
    });
    setEditingCategoryId(category.id);
  };

  return (
    <div
      className={cn('md:w-32 w-24 hover:scale-105 hover:shadow-2xl relative')}>
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 font-bold',
          activeSubmit && !activeCategory && active?.id
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
          className="flex-col items-center justify-center px-3 py-2 rounded-md transition-all bg-blue-50 border border-blue-200 group"
          style={{
            backgroundColor: category.color,
            color: getTextColorForHex(category.color),
          }}>
          <CustomTooltip
            content={condition ? '' : category.title}
            location="top">
            <button className="cursor-pointer" onClick={folderClick}>
              <Folder className="md:size-24 size-16" />
            </button>
          </CustomTooltip>

          <div className="flex items-center justify-center">
            <CustomTooltip
              content={t('edit')}
              location="bottom"
              className={cn(condition && 'hidden')}>
              <span
                role="button"
                className="text-md truncate font-bold cursor-pointer"
                onClick={() => {
                  setCategoryData({
                    id: category.id,
                    color: category.color,
                    title: category.title,
                  });
                  setEditingCategoryId(category.id);
                }}>
                {category.title}
              </span>
            </CustomTooltip>
            <DeleteBtn
              className="hidden group-hover:flex"
              onClick={(e) => {
                e.stopPropagation();
                deleteCategory(category.id);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
