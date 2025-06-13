// TODO: 포맷 변환 또는 로직 헬퍼 함수 정의
export const format__Name__Label = (name: string) => `__Name__: ${name}`;

export const sort__Name__List = (items: any[]) => {
  // TODO: 정렬 로직 구현
  return items.sort((a, b) => a.name.localeCompare(b.name));
};
