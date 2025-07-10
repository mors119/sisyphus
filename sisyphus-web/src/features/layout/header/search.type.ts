import { SEARCH_ITEM } from './search.constants';

export interface SearchResponse {
  type: SEARCH_ITEM;
  id: number;
  title: string;
}
