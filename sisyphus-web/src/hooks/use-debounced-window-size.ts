import { useWindowSize } from 'react-use';
import { useEffect, useState } from 'react';

// react use 사용하되 delay 시간을 정해서 성능 향상

function useDebouncedWindowSize(delay = 150) {
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

export default useDebouncedWindowSize;
