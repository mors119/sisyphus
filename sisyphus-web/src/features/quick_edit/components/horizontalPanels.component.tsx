import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

import { CustomCard } from '@/components/custom/customCard';
import { useState } from 'react';
import { NoteField } from './noteField.component';
import { Button } from '@/components/ui/button';
import { useCategoryStore } from '@/features/category/category.store';
import { CategoryField } from '@/features/category/CategoryField.widget';
import { CategoryFormUnified } from '@/features/category/Category.form';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { CustomTooltip } from '@/components/custom/customTooltip';

export const HorizontalPanels = () => {
  const [horizontalSizes, setHorizontalSizes] = useState<number[]>(() => {
    // 초기 로딩 시 localStorage에서 불러오기
    const saved = localStorage.getItem('horizontal-sizes');
    return saved ? JSON.parse(saved) : [50, 50];
  });

  const { setEditingCategoryId, editingCategoryId } = useCategoryStore();
  const { t } = useTranslation();

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
            <CustomTooltip content={t('quick.drag_msg')} location="top">
              <Button variant="ghost" className="cursor-auto hover:bg-none">
                {t('quick.new')}
                <span className="text-xs text-neutral-500 ">
                  {t('quick.no_category')}
                </span>
              </Button>
            </CustomTooltip>
          }
          content={<NoteField />}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={horizontalSizes[1]}>
        <CustomCard
          className="h-full"
          title={
            <CustomTooltip content={t('quick.cate_drag_msg')} location="top">
              <Button
                variant="ghost"
                onClick={() => {
                  if (editingCategoryId !== 0) {
                    setEditingCategoryId(0);
                  } else {
                    setEditingCategoryId(null);
                  }
                }}>
                {t('quick.category')}
                <span className="text-xs text-neutral-500">
                  {t('quick.category_msg')}
                </span>
              </Button>
            </CustomTooltip>
          }
          content={
            <div className="relative h-full">
              <CategoryField condition={false} />
              <div
                className={cn(
                  'flex justify-center max-w-0 absolute top-0 pt-4 right-0 h-full items-center bg-white dark:bg-black duration-300',
                  editingCategoryId != null &&
                    'max-w-full w-full duration-300 p-4',
                )}>
                {editingCategoryId != null && <CategoryFormUnified />}
              </div>
            </div>
          }
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
