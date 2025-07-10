import { useWindowSize } from 'react-use';
import { useEffect, useState } from 'react';

/**  window size에 따른 변화 디바운싱
 * @prop delay {number}
 *
 * @return debouncedSize {width, height}
 */
export function useDebouncedWindowSize(delay = 150) {
  const { width, height } = useWindowSize();
  const [debouncedSize, setDebouncedSize] = useState({ width, height });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSize({ width, height });
    }, delay);

    return () => clearTimeout(handler);
  }, [width, height, delay]);

  return debouncedSize;
}

/**  state value debounce
 * @prop value {T}
 * @prop delay {number}
 *
 * @return debounced {T}
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
