import { TagAndLevel, TagProps } from '@/types/tag';

export interface TagTree extends TagProps {
  children: TagTree[];
}

export function toTagTree(flat: TagProps[] | undefined): TagTree[] {
  if (!flat) return [];

  const idMap = new Map<number, TagTree>();
  const roots: TagTree[] = [];

  // 초기화: children 추가
  flat.forEach((tag) => {
    idMap.set(tag.id, { ...tag, children: [] });
  });

  flat.forEach((tag) => {
    const node = idMap.get(tag.id)!;
    if (tag.parentId !== null) {
      const parent = idMap.get(tag.parentId);
      if (parent) parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export interface FlatTagNode extends Omit<TagProps, 'children'> {
  depth: number;
}

//  트리를 평탄화해서 depth와 parentId 정보가 있는 배열로 변환
export const flattenTree = (
  tree: TagProps[],
  depth = 0,
  parentId: number | null = null,
): FlatTagNode[] => {
  return tree.flatMap((node) => {
    const flatNode: FlatTagNode = {
      id: node.id,
      title: node.title,
      color: node.color,
      parentId: parentId ?? null,
      depth,
    };
    const children = node.children
      ? flattenTree(node.children, depth + 1, node.id)
      : [];
    return [flatNode, ...children];
  });
};

// 평탄화된 배열을 다시 계층형 트리로 복원
export const buildTreeFromFlat = (flat: FlatTagNode[]): TagProps[] => {
  const nodeMap = new Map<number, TagProps>();

  // 먼저 모든 노드를 초기화
  flat.forEach(({ id, title, color, parentId }) => {
    nodeMap.set(id, { id, title, color, parentId, children: [] });
  });

  const root: TagProps[] = [];

  flat.forEach(({ id, parentId }) => {
    const node = nodeMap.get(id)!;
    if (parentId == null) {
      root.push(node);
    } else {
      const parent = nodeMap.get(parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(node);
      }
    }
  });

  return root;
};

// 트리를 평탄화하며 level과 childrenId를 추가한 배열로 변환
// (tag -> tree형 -> depth와 children 계산 후 다시 평탄화)
export const toTagAndLevelList = (
  tree: ReturnType<typeof toTagTree>,
  level: number = 0,
): TagAndLevel[] => {
  return tree.flatMap((tag) => {
    const item: TagAndLevel = {
      id: tag.id,
      title: tag.title,
      color: tag.color,
      parentId: tag.parentId,
      level,
      childrenId: tag.children?.map((c) => c.id) ?? [],
    };
    const children = tag.children
      ? toTagAndLevelList(tag.children, level + 1)
      : [];
    return [item, ...children];
  });
};
