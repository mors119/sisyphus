import { Logo } from '@/features/auth/components/Logo.component';
import { SocialLoginButtons } from './components/SocialLoginButtons.component';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Suspense } from 'react';
import { Loader } from '@/components/custom/Loader';
import { PATHS } from '@/app/router/paths.constants';

const AuthLayout = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center mx-auto w-full h-dvh">
      <Logo className="py-10" />
      <div className="border-2 border-point-yellow p-1 rounded-xl bg-white dark:bg-neutral-900">
        <div className="border-2 p-4 border-point-blue rounded-xl">
          <h1 className="text-center text-xl pb-3 font-semibold text-accent-foreground">
            {t(
              location.pathname === PATHS.AUTH_SIGN_IN
                ? 'signin.signin'
                : 'signup.signup',
            )}
          </h1>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
          <div className="text-xs pt-2 flex justify-center">
            <p className="mr-1">
              {t(
                location.pathname === PATHS.AUTH_SIGN_IN
                  ? 'signin.notYet'
                  : 'signup.already',
              )}
            </p>
            <Link
              to={
                location.pathname === PATHS.AUTH_SIGN_IN
                  ? PATHS.AUTH_SIGN_UP
                  : PATHS.AUTH_SIGN_IN
              }
              className="text-blue-500  hover:underline">
              {t(
                location.pathname === PATHS.AUTH_SIGN_IN
                  ? 'signup.signup'
                  : 'signin.signin',
              )}
            </Link>
          </div>

          <SocialLoginButtons />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
