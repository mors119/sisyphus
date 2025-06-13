import { TagData } from '@/types/tag';
import { create } from 'zustand';

interface TagStore {
  tagData: TagData;
  tagArray: TagData[];
  setTagData: (tag: TagData) => void;
  setTagArray: (tag: TagData[]) => void;

  editingTagId: number | null;
  setEditingTagId: (tagId: number | null) => void;
  onDone: () => void;
  collapsedIds: Set<number>;
  toggleCollapse: (id: number) => void;
  isCollapsed: (id: number) => boolean;
}

export const useTagStore = create<TagStore>()((set, get) => ({
  tagData: { id: null, title: '', color: '', parentId: null },
  tagArray: [],
  setTagData: (tag) => set({ tagData: tag }),
  setTagArray: (tags) => set({ tagArray: tags }),
  editingTagId: null,
  setEditingTagId: (tagId) => set({ editingTagId: tagId }),
  onDone: () =>
    set({
      editingTagId: null,
      tagData: { id: null, title: '', color: '', parentId: null },
    }),
  collapsedIds: new Set(),
  toggleCollapse: (id) => {
    const next = new Set(get().collapsedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    set({ collapsedIds: next });
  },
  isCollapsed: (id) => get().collapsedIds.has(id),
}));
