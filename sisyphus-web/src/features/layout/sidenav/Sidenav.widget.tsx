import { Link } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import { Separator } from '@/components/ui/separator';
import { Logo } from './SidenavLogo.presenter';
import { useSidenavState } from './useSidenavState.hook';
import { SidenavMenu } from './SidenavMenu.container';

import { LanguageSelector } from './LanguageSelector.container';
import { ThemeToggle } from '../../theme/ThemeToggle.component';
import { PATHS } from '@/app/router/paths.constants';
import { PolicySidenav } from '@/features/layout/sidenav/PolicySidenav.component';

export const Sidenav = () => {
  const { open, location, handleClick, role } = useSidenavState();
  // const { t } = useTranslation();

  return (
    <Sidebar collapsible="icon">
      {/* Sidebar Header */}
      <SidebarHeader className={cn(!open && 'h-14')}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-accent duration-500 dark:hover:bg-accent/10 relative"
              asChild>
              <Link
                to={PATHS.HOME}
                className={cn(
                  ' relative max-w-80 justify-between flex items-center dark:hover:bg-accent/50',
                  open && 'h-16',
                  !open && 'justify-center',
                )}
                onClick={handleClick}>
                <Logo open={open} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar content */}
      <SidebarContent>
        <Separator />
        <SidebarGroup>
          {/* <SidebarGroupLabel className="text-md pb-3">
            {t('item.menu')}
          </SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu className="flex-col gap-2">
              <SidenavMenu
                currentPath={location.pathname}
                onClick={handleClick}
                role={role}
                open={open}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar footer */}
      <SidebarFooter>
        <PolicySidenav open={open} />
        <Separator />
        <div className={cn(open && 'flex items-center justify-between')}>
          <LanguageSelector open={open} />
          <ThemeToggle open={open} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
