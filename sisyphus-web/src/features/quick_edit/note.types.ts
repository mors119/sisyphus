import { z } from 'zod';
import { CategorySummary } from '../category/category.types';
import { TagResponse } from '../tag/tag.type';
import { noteSchema } from '../view/view.schema';
import { ImageResponse } from '../image/image.type';

export interface NoteResponse {
  id: number;
  title: string;
  subTitle?: string;
  description?: string;
  tags?: TagResponse[];
  category?: CategorySummary;
  createdAt: string;
  image?: ImageResponse[];
}

// 무한 스크롤 페이지를 위한 타입 (backend에서 page<>타입으로 return 할 때)
// export interface NotePageResponse {
//   content: NoteResponse[];
//   pageable: { pageNumber: number };
//   last: boolean;
//   totalPages: number;
// }

export interface NotePageResponse {
  content: NoteResponse[];
  page: number; // 수정: pageNumber → page
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface SortOption {
  field: string;
  order: 'asc' | 'desc';
}

export interface NoteQueryParams {
  page: number;
  size?: number;
  sortOption: SortOption;
  categoryId?: number | null;
  tagId?: number | null;
  tit?: string | null;
}

export type NoteForm = z.infer<typeof noteSchema>;
