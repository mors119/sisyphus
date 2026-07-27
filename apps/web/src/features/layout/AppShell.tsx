import { Suspense, type ReactNode } from 'react';

import { LoadingState } from '@/components/custom/Loader';
import { SidebarProvider } from '@/components/ui/sidebar';

import { Header } from './header/Header.widget';
import { Sidenav } from './sidenav/Sidenav.widget';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <Sidenav />
      <div className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-background">
        <Header />
        <main className="relative min-h-0 flex-1">
          <Suspense fallback={<LoadingState />}>{children}</Suspense>
        </main>
      </div>
    </SidebarProvider>
  );
}
