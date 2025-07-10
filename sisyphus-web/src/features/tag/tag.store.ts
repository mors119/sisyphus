import { create } from 'zustand';
import { TagResponse } from './tag.type';

interface TagStore {
  /** 태그 배열을 한 번에 교체 */
  tags: TagResponse[];
  setTags: (tags: TagResponse[]) => void;
}

// ❸ zustand 스토어
export const useTagStore = create<TagStore>()((set) => ({
  tags: [],
  setTags: (tags) => set(() => ({ tags })),
}));
