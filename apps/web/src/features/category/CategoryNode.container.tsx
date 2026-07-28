import { cn } from '@/lib/utils';
import { DeleteBtn } from '@/components/custom/Btn';
import { useCategoryStore } from './category.store';
import { getColorUtils } from '@/utils/getColorUtils.util';
import { useDeleteCategoryMutation } from './category.mutation';
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
  const { t } = useTranslation();

  const openCategory = () => {
    setCategoryData({
      id: category.id,
      color: category.color,
      title: category.title,
    });
    setEditingCategoryId(category.id);
  };

  return (
    <div className="relative md:w-32 w-24">
      <div
        className="group flex-col items-center justify-center rounded-md border border-brand-primary bg-brand-primary-subtle px-3 py-2 transition-all"
        style={{
          backgroundColor: category.color,
          color: getTextColorForHex(category.color),
        }}>
        <CustomTooltip content={condition ? '' : category.title} location="top">
          <button type="button" className="cursor-pointer" onClick={openCategory}>
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
              className="cursor-pointer truncate text-md font-bold"
              onClick={openCategory}>
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
  );
};
