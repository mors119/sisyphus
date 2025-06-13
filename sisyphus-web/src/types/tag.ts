export interface TagAndLevel {
  id: number;
  title: string;
  color: string;
  parentId: number | null;
  level: number | null;
  childrenId: number[] | [];
}

export interface TagProps {
  id: number;
  title: string;
  color: string;
  parentId: number | null;
  children: TagProps[] | null;
}

export interface TagSummary {
  id: number;
  title: string;
  color: string;
  parentId?: number | null;
}

export interface TagData {
  id: number | null;
  title: string;
  color: string;
  parentId: number | null;
}
