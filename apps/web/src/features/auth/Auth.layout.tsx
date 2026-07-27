import { Logo } from '@/features/auth/components/Logo.component';
import { SocialLoginButtons } from './components/SocialLoginButtons.component';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Suspense } from 'react';
import { LoadingState } from '@/components/custom/Loader';
import { PATHS } from '@/app/router/paths.constants';
import { PageContent, PageLayout } from '@/features/layout';

const AuthLayout = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <PageLayout className="min-h-dvh items-center py-0">
      <Logo className="py-10" />
      <PageContent width="narrow" className="brand-frame">
        <div className="brand-frame-inner p-4">
          <h1 className="pb-3 text-center text-xl font-semibold text-accent-foreground">
            {t(
              location.pathname === PATHS.AUTH_SIGN_IN
                ? 'signin.signin'
                : 'signup.signup',
            )}
          </h1>
          <Suspense fallback={<LoadingState compact />}>
            <Outlet />
          </Suspense>
          <div className="flex justify-center pt-2 text-xs">
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
      </PageContent>
    </PageLayout>
  );
};

export default AuthLayout;
