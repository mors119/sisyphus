import { useDebouncedWindowSize } from './useDebounce';

export const useScreen = () => {
  const { width, height } = useDebouncedWindowSize(200);

  const isMobile = width <= 767;
  const isTablet = width > 767 && width <= 1024;
  const isDesktop = width > 1024;

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
  };
};
