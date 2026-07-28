import { Outlet } from 'react-router-dom';

import { AppShell } from './AppShell';

const Layout = () => {
  return (
    <AppShell>
      <div className="h-full min-h-0">
        <Outlet />
      </div>
    </AppShell>
  );
};

export default Layout;
