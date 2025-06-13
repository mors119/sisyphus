import { TagAndLevel } from '@/types/tag';

import { create } from 'zustand';

interface DndStore {
  tree: TagAndLevel[];
  setTree: (next: TagAndLevel[]) => void;
  activeTag: TagAndLevel | null;
  setActiveTag: (tag: TagAndLevel | null) => void;
  activeSubmit: string | null;
  setActiveSubmit: (note: string | null) => void;
  activeDone: () => void;
}

export const useDndStore = create<DndStore>((set) => ({
  tree: [],
  setTree: (next) => set({ tree: next }),
  activeTag: null,
  setActiveTag: (tag) => set({ activeTag: tag }),
  activeSubmit: null,
  setActiveSubmit: (note) => set({ activeSubmit: note }),
  activeDone: () => set({ activeTag: null, activeSubmit: null }),
}));
