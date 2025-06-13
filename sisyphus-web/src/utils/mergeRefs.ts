// 하나의 요소에 2개의 ref 사용
export function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  // ref에 넘겨지는 null 값을 허용해야 HTML Element 사용 가능
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') ref(node);
      else if (ref && typeof ref === 'object' && 'current' in ref)
        (ref as React.RefObject<T | null>).current = node;
    });
  };
}
