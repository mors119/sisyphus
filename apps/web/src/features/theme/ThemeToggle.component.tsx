import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from './theme.store';
import { Button } from '@/components/ui/button';
import { CustomTooltip } from '@/components/custom/customTooltip';
import { useTranslation } from 'react-i18next';

export const ThemeToggle = ({ open }: { open: boolean }) => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { t } = useTranslation();

  if (open)
    return (
      <div className="flex gap-2 dark:bg-black md:dark:bg-none">
        <Moon size={20} />
        <Switch
          aria-label={t('tooltip.theme')}
          checked={theme === 'dark'}
          onCheckedChange={toggleTheme}
          className="data-[state=checked]:bg-neutral-700"
        />
        <Sun size={20} className="text-brand-accent" />
      </div>
    );
  return (
    <CustomTooltip content={t('tooltip.theme')} location="right">
      <Button
        variant="ghost"
        aria-label={t('tooltip.theme')}
        className="ml-[-4px] dark:bg-black md:dark:bg-none"
        onClick={toggleTheme}>
        {theme === 'light' ? <Sun /> : <Moon className="text-brand-accent" />}
      </Button>
    </CustomTooltip>
  );
};
