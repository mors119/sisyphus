// 디바운스: 마지막 동작만 실행
export const debounce = (fn: () => void, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
};
