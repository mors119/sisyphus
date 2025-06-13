import { TagAndLevel } from '@/types/tag';

// tag를 부모와 자식 순으로 정렬
export const sortByParentChildHierarchy = (
  flat: TagAndLevel[],
): TagAndLevel[] => {
  const idMap = new Map<number, TagAndLevel>();
  flat.forEach((tag) => idMap.set(tag.id, tag));

  const sorted: TagAndLevel[] = [];

  const visit = (tag: TagAndLevel) => {
    sorted.push(tag);
    tag.childrenId?.forEach((childId) => {
      const child = idMap.get(childId);
      if (child) visit(child);
    });
  };

  // level 0부터 시작해서 위에서 아래로 순회
  flat
    .filter((tag) => tag.level === 0)
    .forEach((rootTag) => {
      visit(rootTag);
    });

  return sorted;
};
