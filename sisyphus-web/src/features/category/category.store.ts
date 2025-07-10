import { create } from 'zustand';
import { CategoryData } from './category.types';

interface CategoryStore {
  categoryData: CategoryData;
  categoryArray: CategoryData[];
  setCategoryData: (category: CategoryData) => void;
  setCategoryArray: (category: CategoryData[]) => void;
  editingCategoryId: number | null;
  setEditingCategoryId: (categoryId: number | null) => void;
  onDone: () => void;
}

export const useCategoryStore = create<CategoryStore>()((set) => ({
  categoryData: { id: null, title: '', color: '' },
  categoryArray: [],
  setCategoryData: (category) => set({ categoryData: category }),
  setCategoryArray: (categories) => set({ categoryArray: categories }),
  editingCategoryId: null,
  setEditingCategoryId: (categoryId) => set({ editingCategoryId: categoryId }),
  onDone: () =>
    set({
      editingCategoryId: null,
      categoryData: { id: null, title: '', color: '' },
    }),
}));
