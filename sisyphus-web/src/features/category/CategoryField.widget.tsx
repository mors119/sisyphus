import { CategoryFormUnified } from './Category.form';
import { useCategoriesQuery } from '@/features/category/category.query';
import { CategoryNode } from './CategoryNode.container';
import { useEffect } from 'react';
import { Loader } from '@/components/custom/Loader';
import { ErrorState } from '@/components/custom/Error';
import { useCategoryStore } from './category.store';
import { CategorySummary } from './category.types';
import { EmptyState } from '@/components/custom/Empty';

export const CategoryField = ({ condition }: { condition: boolean }) => {
  const { data, isLoading, error } = useCategoriesQuery();
  const { setCategoryArray } = useCategoryStore();

  useEffect(() => {
    if (data) {
      setCategoryArray(data);
    }
  }, [data, setCategoryArray]);

  if (isLoading) return <Loader />;

  if (error) return <ErrorState />;

  if (!data || data.length === 0) return <EmptyState />;

  if ((!condition && !data) || data.length === 0) {
    return (
      <div className="relative flex justify-center top-0 right-0 bg-white max-w-full w-full h-[300px]">
        <CategoryFormUnified />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-0.5 flex-1">
      {data.map((category: CategorySummary) => (
        <CategoryNode
          key={category.id}
          category={category}
          condition={condition}
        />
      ))}
    </div>
  );
};
