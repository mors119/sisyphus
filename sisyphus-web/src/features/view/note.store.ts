import { create } from 'zustand';
import { NoteResponse, SortOption } from '../quick_edit/note.types';

export const createEmptyNote = (): NoteResponse => ({
  id: 0,
  title: '',
  subTitle: '',
  description: '',
  tags: [],
  createdAt: '',
  category: { id: 0, title: '', color: '' },
});

interface NoteStore {
  editNote: NoteResponse;
  setEditNote: (note: NoteResponse) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  toggleSortField: (field: string) => void;
  done: () => void;
}

export const useNoteStore = create<NoteStore>()((set) => ({
  editNote: createEmptyNote(),
  setEditNote: (note) => set({ editNote: note }),
  sortOption: { field: 'createdAt', order: 'desc' },
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
  done: () => set({ editNote: createEmptyNote() }),
}));
