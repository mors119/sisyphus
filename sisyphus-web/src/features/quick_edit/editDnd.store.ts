import { create } from 'zustand';
import { CategorySummary } from '../category/category.types';

interface DndStore {
  activeCategory: CategorySummary | null;
  setActiveCategory: (category: CategorySummary | null) => void;
  activeSubmit: boolean;
  setActiveSubmit: (note: boolean) => void;
  activeDone: () => void;
}

export const useDndStore = create<DndStore>((set) => ({
  activeCategory: null,
  setActiveCategory: (category) => set({ activeCategory: category }),
  activeSubmit: false,
  setActiveSubmit: (note) => set({ activeSubmit: note }),
  activeDone: () => set({ activeCategory: null, activeSubmit: false }),
}));
