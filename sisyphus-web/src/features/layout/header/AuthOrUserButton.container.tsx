import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useUserHydration } from '../../user/useUserHydration.hook';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomAvatar } from '@/components/custom/customAvatar';
import { CustomAlert } from '@/components/custom/customAlert';
import { useTranslation } from 'react-i18next';
import { useLogoutMutation } from '@/features/auth/auth.mutation';
import { cn } from '@/lib/utils';
import { PATHS } from '@/app/router/paths.constants';

export const AuthOrUserButton = () => {
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { user, isLoading } = useUserHydration();
  const { t } = useTranslation();
  const { mutate: performLogout } = useLogoutMutation();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="w-[80px] h-10 rounded-md" />
        <Skeleton className="w-[80px] h-10 rounded-md" />
      </div>
    );
  }

  if (user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger className="dark:border-none">
            <CustomAvatar user={user} />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-bold">
              {t('access.myAccount')}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate('user')}>
              {t('access.myAccount')}
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => {
                // ! focus 싸움 일어나지 않도록 주의 (onClick 대신 onSelect 사용)
                // e.preventDefault 사용하면 안 닫힘.
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur(); // focus 제거
                }
                requestAnimationFrame(() => {
                  setShowLogoutDialog(true); // 모달은 다음 렌더에서 열림
                });
              }}>
              {t('signout.signout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <CustomAlert
          title={t('signout.signout')}
          desc={t('signout.description')}
          action={t('signout.signout')}
          open={showLogoutDialog}
          setOpen={setShowLogoutDialog}
          onAction={performLogout}
        />
      </>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="sisyphus"
        asChild
        className={cn(
          'md:block hidden border',
          location.pathname === PATHS.HOME && 'text-white',
        )}>
        <Link to="/auth/signup">{t('signup.signup')}</Link>
      </Button>
      <Button
        variant="sisyphus"
        asChild
        className={cn(
          'border',
          location.pathname === PATHS.HOME && 'text-white',
        )}>
        <Link to="/auth/signin">{t('signin.signin')}</Link>
      </Button>
    </div>
  );
};
