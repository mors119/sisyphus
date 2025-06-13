import { useEffect, useState } from 'react';
import { userReadApi } from '@/services/user/route';
import { useAuthStore } from '@/stores/auth-store';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CustomAvatar } from '@/components/custom/custom-avatar';
import { Button } from '@/components/ui/button';
import { CustomAlert } from '@/components/custom/custom-alert';

import { logoutApi } from '@/services/auth/route';
import { Skeleton } from '@/components/ui/skeleton';

export const AuthOrUserButton = () => {
  // const { accessToken, setUser, user } = useAuthStore();
  // 위와 다르게 직접 구동하면서 reRendering을 유발함
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // 1. hydration flag 설정
  useEffect(() => {
    setHydrated(true);
  }, []);

  // 2. accessToken + hydrated 준비됐을 때만 fetch
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userReadApi();
        setUser(data);
      } catch (err) {
        console.error('유저 정보 로딩 실패: ', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (hydrated && accessToken && !user) {
      fetchUser();
    } else {
      setIsLoading(false);
      console.log('setIsLoading:', isLoading);
    }
  }, [hydrated, accessToken, user]);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error(err);
    } finally {
      useAuthStore.getState().clear();
      setShowLogoutDialog(false);
      localStorage.removeItem('auth-storage');
      navigate('/');
    }
  };

  // Skeleton
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="w-[80px] h-10 rounded-md" />
        <Skeleton className="w-[80px] h-10 rounded-md" />
      </div>
    );
  }

  // 유저 정보가 로딩되지 않았더라도 accessToken이 있으면 사용자로 간주
  if (user != null) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <CustomAvatar user={user} />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="" onClick={() => navigate('user')}>
              내 정보
            </DropdownMenuItem>
            {/* <DropdownMenuItem className="" onClick={() => navigate('settings')}>
              설정
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => setShowLogoutDialog(true)}>
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <CustomAlert
          title="Sign out"
          desc="로그아웃 하시겠습니까?"
          action="Sign out"
          open={showLogoutDialog}
          setOpen={setShowLogoutDialog}
          onAction={() => {
            handleLogout(); // 로그아웃 처리
            setShowLogoutDialog(false); // 모달 닫기
          }}
        />
      </>
    );
  }

  // 비로그인 상태 → 로그인/회원가입 버튼
  return (
    <div className="flex gap-2">
      <Button variant="sisyphus" asChild className="md:block hidden">
        <Link to="/auth?page=signup">Sign up</Link>
      </Button>
      <Button variant="sisyphus" asChild>
        <Link to="/auth?page=signin">Sign in</Link>
      </Button>
    </div>
  );
};
