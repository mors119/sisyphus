import { create } from 'zustand';
import { CategorySummary } from '../category/category.types';

export type ActiveDrag =
  | { kind: 'none' }
  | { kind: 'category'; category: CategorySummary }
  | { kind: 'note' };

interface DndStore {
  activeDrag: ActiveDrag;
  startCategoryDrag: (category: CategorySummary) => void;
  startNoteDrag: () => void;
  activeDone: () => void;
}

export const useDndStore = create<DndStore>((set) => ({
  activeDrag: { kind: 'none' },
  startCategoryDrag: (category) =>
    set({ activeDrag: { kind: 'category', category } }),
  startNoteDrag: () => set({ activeDrag: { kind: 'note' } }),
  activeDone: () => set({ activeDrag: { kind: 'none' } }),
}));

export const isCategoryDrag = (
  drag: ActiveDrag,
): drag is { kind: 'category'; category: CategorySummary } =>
  drag.kind === 'category';

export const isNoteDrag = (drag: ActiveDrag): drag is { kind: 'note' } =>
  drag.kind === 'note';
