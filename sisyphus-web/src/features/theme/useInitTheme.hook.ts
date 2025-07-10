import { useEffect } from 'react';
import { useThemeStore } from './theme.store';

export const useInitTheme = () => {
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      if (!systemPrefersDark) return setTheme('dark');
      const systemTheme: 'light' | 'dark' = systemPrefersDark
        ? 'dark'
        : 'light';
      setTheme(systemTheme);
    }
  }, [setTheme]);
};
