import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

import { AuthOrUserButton } from './AuthOrUserButton.container';
import { SearchBar } from './SearchBar.container';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CustomTooltip } from '@/components/custom/customTooltip';
import { useTranslation } from 'react-i18next';
import { PATHS } from '@/app/router/paths.constants';

export const Header = () => {
  const { setOpen, open } = useSidebar();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <header
      className={cn(
        location.pathname === PATHS.HOME ? 'bg-black' : 'border-b-1 shadow',
        'w-full flex justify-center',
      )}>
      <div className="h-14 flex justify-between w-full items-center gap-2 md:gap-1 ">
        <div className="p-1 flex justify-center items-center h-14 px-4">
          <CustomTooltip content={t('tooltip.sidebar')}>
            <SidebarTrigger
              className={cn(
                location.pathname === PATHS.HOME && 'bg-white dark:bg-black',
              )}
              onClick={() => setOpen(!open)}
            />
          </CustomTooltip>
        </div>
        <div className="flex items-center gap-2 h-14 px-4">
          <SearchBar />
          <AuthOrUserButton />
        </div>
      </div>
    </header>
  );
};
