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
    <div className="flex min-h-dvh w-full flex-col items-center px-4">
      <Logo className="py-10" />
      <div className="brand-frame w-full max-w-[var(--content-narrow)]">
        <div className="brand-frame-inner p-4">
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
              className="text-info underline-offset-4 hover:underline">
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
