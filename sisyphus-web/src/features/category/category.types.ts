import { z } from 'zod';
import { useCategorySchema } from './category.schema';

export type CategoryForm = z.infer<ReturnType<typeof useCategorySchema>>;

export interface CategoryResponse {
  id: number;
  title: string;
  color: string;
}

/**
 * @interface category
 * @property id {number}
 * @property title {string}
 * @property color {string}
 * @property parentId? {string}
 */
export interface CategorySummary {
  id: number;
  title: string;
  color: string;
}

export interface CategoryData {
  id: number | null;
  title: string;
  color: string;
}
