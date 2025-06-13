import { TagAndLevel, TagSummary } from './tag';

export const CATEGORY_LIST = ['WORD', 'NOTE', 'TODO', 'ALL'] as const;
export type Category = (typeof CATEGORY_LIST)[number];

export interface NoteRequest {
  title: string;
  subTitle?: string;
  description?: string;
  category: Category;
}

export interface NoteResponse {
  id: number;
  title: string;
  subTitle?: string;
  description?: string;
  tag?: TagSummary;
  category: Category;
  createdAt: string;
}

// 다른 컴포넌트로 전달을 위한 타입
export interface NoteParams {
  id: number;
  title: string;
  subTitle?: string;
  description?: string;
  tagId?: number | TagAndLevel;
  category: 'WORD' | 'NOTE' | 'TODO';
  createdAt?: string;
}

// 무한 스크롤 페이지를 위한 타입
export interface NotePageResponse {
  content: NoteResponse[];
  pageable: { pageNumber: number };
  last: boolean;
  totalPages: number;
}

export interface SortOption {
  field: string;
  order: 'asc' | 'desc';
}

export interface NoteQueryParams {
  page: number;
  size?: number;
  category: Category;
  sortOption: SortOption;
}
