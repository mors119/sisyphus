import { TagResponse } from '@/types/tag';
import { JSX } from 'react';

export const renderTagOptions = (
  tags: TagResponse[],
  level: number = 0,
): JSX.Element[] => {
  return tags.flatMap((tag) => [
    <option key={tag.id} value={tag.id}>
      {'—'.repeat(level)} {tag.title}
    </option>,
    ...(tag.children ? renderTagOptions(tag.children, level + 1) : []),
  ]);
};
