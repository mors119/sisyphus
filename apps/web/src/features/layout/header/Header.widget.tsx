import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

import { AuthOrUserButton } from './AuthOrUserButton.container';
import { SearchBar } from './SearchBar.container';
import { CustomTooltip } from '@/components/custom/customTooltip';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const { setOpen, open } = useSidebar();
  const { t } = useTranslation();

  return (
    <header className="flex w-full justify-center border-b border-border bg-background">
      <div className="flex h-14 w-full items-center justify-between gap-2 md:gap-1">
        <div className="flex h-14 items-center justify-center px-4">
          <CustomTooltip content={t('tooltip.sidebar')}>
            <SidebarTrigger onClick={() => setOpen(!open)} />
          </CustomTooltip>
        </div>
        <div className="flex h-14 items-center gap-2 px-4">
          <SearchBar />
          <AuthOrUserButton />
        </div>
      </div>
    </header>
  );
};
