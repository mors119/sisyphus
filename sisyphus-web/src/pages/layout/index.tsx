import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SideNav } from '@/pages/layout/sidenav';
import { Navbar } from './navbar';

const Layout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <SideNav />
      <div className="flex flex-col w-full">
        <Navbar />
        <main className="h-full relative">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
