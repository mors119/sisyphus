import { useLocation } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserHydration } from '@/features/user/useUserHydration.hook';
import { UserRoles } from '@/features/auth/auth.types';

export function useSidenavState() {
  const { open, setOpenMobile } = useSidebar();
  const { user } = useUserHydration();

  const role: UserRoles = user?.role ?? 'ALL';

  const isMobile = useIsMobile();
  const location = useLocation();

  const handleClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return { open, location, handleClick, role };
}
