import { Logo } from '@/features/auth/components/Logo.component';
import { SocialLoginButtons } from './components/SocialLoginButtons.component';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Suspense } from 'react';
import { LoadingState } from '@/components/custom/Loader';
import { PATHS } from '@/app/router/paths.constants';
import { PageContent, PageHeader, PageLayout } from '@/features/layout';

const AuthLayout = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const isSignIn = location.pathname === PATHS.AUTH_SIGN_IN;

  return (
    <PageLayout className="min-h-dvh items-center justify-center py-8">
      <Logo className="pb-8" />
      <PageContent width="narrow" className="space-y-6">
        <PageHeader
          className="text-center sm:text-left"
          title={t(isSignIn ? 'signin.signin' : 'signup.signup')}
        />
        <Suspense fallback={<LoadingState compact />}>
          <Outlet />
        </Suspense>
        <div className="flex justify-center text-xs text-muted-foreground">
          <p className="mr-1">
            {t(isSignIn ? 'signin.notYet' : 'signup.already')}
          </p>
          <Link
            to={isSignIn ? PATHS.AUTH_SIGN_UP : PATHS.AUTH_SIGN_IN}
            className="text-info underline-offset-4 hover:underline">
            {t(isSignIn ? 'signup.signup' : 'signin.signin')}
          </Link>
        </div>
        <SocialLoginButtons />
      </PageContent>
    </PageLayout>
  );
};

export default AuthLayout;
