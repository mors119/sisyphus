import { Category, NoteResponse, SortOption } from '@/types/note';
import { create } from 'zustand';

export const createEmptyNote = (): NoteResponse => ({
  id: 0,
  title: '',
  subTitle: '',
  description: '',
  // tag: undefined,
  category: 'ALL',
  createdAt: '',
  tag: { id: 0, title: '', color: '', parentId: null },
});

interface NoteStore {
  editNote: NoteResponse;
  setEditNote: (note: NoteResponse) => void;
  category: Category;
  sortOption: SortOption;
  setCategory: (category: Category) => void;
  setSortOption: (option: SortOption) => void;
  toggleSortField: (field: string) => void;
  done: () => void;
}

export const useNoteStore = create<NoteStore>()((set) => ({
  editNote: createEmptyNote(),
  setEditNote: (note) => set({ editNote: note }),
  category: 'ALL',
  sortOption: { field: 'createdAt', order: 'desc' },
  setCategory: (category) => set({ category }),
  setSortOption: (options) => set({ sortOption: options }),
  // 정렬 필드 값 바꾸기
  toggleSortField: (field: string) =>
    set((state) => {
      const { sortOption } = state;
      const isSameField = sortOption.field === field;

      return {
        sortOption: {
          field,
          order: isSameField && sortOption.order === 'asc' ? 'desc' : 'asc',
        },
      };
    }),
  done: () =>
    set({
      editNote: createEmptyNote(),
    }),
}));
