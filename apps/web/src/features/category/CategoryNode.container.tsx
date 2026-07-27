import { useDraggable, useDroppable } from '@dnd-kit/core';
import { mergeRefs } from '@/utils/mergeRefs.util';
import { useMeasure } from 'react-use';
import { cn } from '@/lib/utils';
import { DeleteBtn } from '@/components/custom/Btn';
import { useCategoryStore } from './category.store';
import { getColorUtils } from '@/utils/getColorUtils.util';
import { useDeleteCategoryMutation } from './category.mutation';
import { useDndStore, isCategoryDrag } from '../quick_edit/editDnd.store';
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
  const activeDrag = useDndStore((state) => state.activeDrag);
  const activeCategory = isCategoryDrag(activeDrag) ? activeDrag.category : null;
  const activeSubmit = activeDrag.kind === 'note';
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
            ? 'border-4 border-brand-primary bg-brand-primary-subtle text-info'
            : 'hidden',
          isOver &&
            'z-50 border-4 border-dashed border-brand-accent bg-action-primary text-on-brand-primary shadow-raised',
        )}>
        {isOver ? 'Dorp here' : 'Drop zone'}
      </div>
      <div
        ref={mergeRefs(measureRef, dropRef, dragRef)}
        style={dndStyle}
        {...listeners}
        {...attributes}>
        <div
          className="group flex-col items-center justify-center rounded-md border border-brand-primary bg-brand-primary-subtle px-3 py-2 transition-all"
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
