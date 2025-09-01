import { useEffect, useState } from 'react';

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
