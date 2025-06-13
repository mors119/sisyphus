import { TagFormUnified } from './tag-form';
import { useTagsQuery } from '@/hooks/use-tag-query';
import { toTagAndLevelList, toTagTree } from '@/utils/tree-utils';
import { useTagStore } from '@/stores/tag-store';
import { cn } from '@/lib/utils';
import { TagNode } from './tag-node';
import { useDndStore } from '@/stores/dnd-store';
import { useEffect } from 'react';
import { sortByParentChildHierarchy } from '@/utils/tag-utils';
import { Loader } from '@/components/custom/loader';
import { ErrorState } from '@/components/custom/error';

// TODO: delete, update 시 alert 띄우기
// TODO: tagEditForm open useState 관리 (초기화 시 off, 그리고 '태그 추가'에서 태그 보기 등으로 변경등)

export const TagField = () => {
  const { data, isLoading, error } = useTagsQuery();
  const { editingTagId, setTagArray, isCollapsed } = useTagStore();
  const { tree, setTree } = useDndStore();

  useEffect(() => {
    if (data) {
      setTagArray(data);
      // 트리형태로 데이터 가공 -> level과 childrenId 추가 -> 부모 자식 순으로 정렬
      const flat = sortByParentChildHierarchy(
        toTagAndLevelList(toTagTree(data)),
      );
      setTree(flat);
    }
  }, [data, setTagArray, setTree]);

  // 접었다 폈다
  const filteredTree = tree.map((tag) => {
    let parentId = tag.parentId;
    let visible = true;
    while (parentId !== null) {
      if (isCollapsed(parentId)) {
        visible = false;
        break;
      }
      const parent = tree.find((t) => t.id === parentId);
      parentId = parent?.parentId ?? null;
    }
    return { ...tag, isVisible: visible };
  });

  if (isLoading) return <Loader />;
  if (error) return <ErrorState />;
  if (!data || data.length === 0) {
    return (
      <div className="relative flex justify-center top-0 right-0 bg-white max-w-full w-full h-[300px]">
        <TagFormUnified />
      </div>
    );
  }

  return (
    <div className="relative h-[300px]">
      <div className="space-y-1 h-full flex flex-wrap">
        {filteredTree.map((tag) => (
          <TagNode key={tag.id} tag={tag} />
        ))}
      </div>
      <div
        className={cn(
          'flex justify-center max-w-0 absolute top-0 right-0 h-full bg-white overflow-hidden duration-300',
          editingTagId != null && 'max-w-full w-full duration-300',
        )}>
        {editingTagId != null && <TagFormUnified />}
      </div>
    </div>
  );
};
