import { Home, LayoutDashboard, BookOpen, SquarePen } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';

// import { Logo } from '@/components/logo';

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: BookOpen,
  },
  {
    title: 'Add or Edit',
    url: '/edit',
    icon: LayoutDashboard,
  },
  {
    title: 'Require',
    url: '/require',
    icon: SquarePen,
  },
];

export const SideNav = () => {
  const { open, setOpenMobile } = useSidebar();
  // window size 감지
  const isMobile = useIsMobile();
  const location = useLocation();

  const handleClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-accent duration-500 dark:hover:bg-accent/10 relative"
              asChild>
              <Link
                to="/"
                className={cn(
                  ' relative max-w-80 justify-between flex items-center dark:hover:bg-accent/50',
                  open && 'h-16',
                  !open && 'justify-center',
                )}
                onClick={handleClick}>
                <img
                  src="diagram-logo.png"
                  alt="diagram logo"
                  className={cn(
                    'max-h-14 hidden md:block',
                    open && 'absolute top-0 left-0',
                  )}
                />

                <img
                  src="text-logo.png"
                  alt="text logo"
                  className={cn(
                    'md:absolute md:w-48 w-40',
                    open && 'w-48 top-[50] right-0',
                  )}
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Separator />
        <SidebarGroup>
          <SidebarGroupLabel className="text-md pb-3">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'hover:text-[#ffcd49] hover:bg-[#1186ce] duration-300',
                      location.pathname === item.url &&
                        'text-[#1186ce] hover:bg-color-none hover:text-none',
                    )}>
                    <Link to={item.url} onClick={handleClick}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <Separator className="my-3" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={user.data} /> */}</SidebarFooter>
    </Sidebar>
  );
};
