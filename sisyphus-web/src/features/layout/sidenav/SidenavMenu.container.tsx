import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SIDENAV_ITEMS } from './sidenav.constants';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserRoles } from '@/features/auth/auth.types';
import { CustomTooltip } from '@/components/custom/customTooltip';

interface Props {
  currentPath: string;
  onClick: () => void;
  role: UserRoles;
  open: boolean;
}

export const SidenavMenu = ({ currentPath, onClick, role, open }: Props) => {
  const { t } = useTranslation();

  // role이 있으면 필터링하고, 없으면(null) 빈 배열을 할당
  if (!role) return null;
  const filteredItems = SIDENAV_ITEMS.filter((item) =>
    item.roles.includes(role),
  );

  return (
    <>
      {filteredItems.map((item) => (
        <SidebarMenuItem key={t(item.title)}>
          <CustomTooltip
            className={cn(open && 'hidden')}
            content={t(item.title)}
            location="right">
            <SidebarMenuButton
              asChild
              className={cn(
                'hover:text-[#ffcd49] hover:bg-[#1186ce] duration-300',
                currentPath === item.url &&
                  'text-[#1186ce] hover:bg-color-none hover:text-none cursor-auto',
              )}>
              <Link
                to={item.url}
                onClick={onClick}
                aria-disabled={currentPath === item.url}
                className="flex justify-center gap-5 dark:bg-black md:bg-none">
                <item.icon size={18} />
                {open && <span>{t(item.title)}</span>}
              </Link>
            </SidebarMenuButton>
          </CustomTooltip>
        </SidebarMenuItem>
      ))}
    </>
  );
};
