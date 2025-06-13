import { create } from 'zustand';

interface ScreenState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  setSize: (width: number, height: number) => void;
}

const MOBILE = 767;
const TABLET = 1024;

export const useScreenStore = create<ScreenState>((set) => ({
  width: typeof window !== 'undefined' ? window.innerWidth : 0,
  height: typeof window !== 'undefined' ? window.innerHeight : 0,
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  setSize: (width, height) =>
    set(() => ({
      width,
      height,
      isMobile: width <= MOBILE,
      isTablet: width > MOBILE && width <= TABLET,
      isDesktop: width > TABLET,
    })),
}));
