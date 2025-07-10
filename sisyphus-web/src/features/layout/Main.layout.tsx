import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from './header/Header.widget';
import { Sidenav } from './sidenav/Sidenav.widget';
import { Suspense } from 'react';
import { Loader } from '@/components/custom/Loader';

const Layout = () => {
  return (
    <SidebarProvider defaultOpen={false}>
      <Sidenav />
      <div className="flex flex-col w-full relative">
        <Header />
        <main className="h-full relative">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
