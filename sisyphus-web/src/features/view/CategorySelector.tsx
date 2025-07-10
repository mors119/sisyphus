import { useRef } from 'react';
import { useClickAway } from 'react-use';

import { cn } from '@/lib/utils';
import { getColorUtils } from '@/utils/getColorUtils.util';
import { CategorySummary } from '../category/category.types';
import { useTranslation } from 'react-i18next';

export const CategorySelector = ({
  categoryId,
  open,
  setCategoryId,
  setOpen,
  data: categoryArray,
}: {
  categoryId: number | null;
  open: boolean;
  setCategoryId: (id: number | null) => void;
  setOpen: (bool: boolean) => void;
  data: CategorySummary[];
}) => {
  const ref = useRef(null);
  const { getTextColorForHex } = getColorUtils();
  const { t } = useTranslation();

  useClickAway(ref, () => setOpen(false));

  if (!categoryArray) return null;

  const selectedCategory = categoryArray.find(
    (cate: CategorySummary) => cate.id === categoryId,
  );

  return (
    <div className="relative text-center" ref={ref}>
      <div
        onClick={() => {
          if (categoryId) {
            setCategoryId(null);
            setOpen(false);
          } else {
            setOpen(!open);
          }
        }}
        className="rounded cursor-pointer truncate w-full hover:brightness-110"
        style={{
          backgroundColor: selectedCategory?.color || '',
          color: selectedCategory && getTextColorForHex(selectedCategory.color),
        }}>
        {selectedCategory?.title || t('category.page.category')}
      </div>
      {open && (
        <ul className="absolute z-10 w-full max-h-30">
          {categoryArray?.map((category: CategorySummary) => (
            <li
              key={category.id}
              style={{
                backgroundColor: category.color,
                color: getTextColorForHex(category.color),
              }}
              className={cn(
                ' hover:brightness-110 cursor-pointer truncate rounded',
              )}
              onClick={() => {
                setCategoryId(category.id);
                setOpen(false);
              }}>
              {category.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
