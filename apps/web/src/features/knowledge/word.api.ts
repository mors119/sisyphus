import { fetchNotes } from '../view/view.api';
import { WordInputError } from './word.types';

const DEFAULT_SORT = { field: 'createdAt', order: 'desc' as const };

export async function findDuplicateWord(word: string): Promise<boolean> {
  try {
    const response = await fetchNotes({
      page: 0,
      size: 20,
      sortOption: DEFAULT_SORT,
      tit: word,
    });

    const normalized = word.toLowerCase();
    return response.content.some(
      (note) => note.title.trim().toLowerCase() === normalized,
    );
  } catch {
    throw new WordInputError('request');
  }
}

/**
 * Accepts a validated word for expansion. The expansion engine integrates in a
 * later issue; this intake step confirms the word is unique for the user.
 */
export async function submitWordForExpansion(word: string): Promise<void> {
  const isDuplicate = await findDuplicateWord(word);

  if (isDuplicate) {
    throw new WordInputError('duplicate');
  }
}
