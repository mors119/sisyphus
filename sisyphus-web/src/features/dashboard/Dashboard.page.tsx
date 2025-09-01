import { DashboardRequire } from './require/dashboardRequire.component';
import { DashboardTop } from './user/DashboardUser';

const DashboardPage = () => {
  return (
    <div className="p-2">
      <h1 className="px-5 py-2 font-bold text-2xl">DashBoard</h1>
      <div className="m-2 border p-2">
        <h2 className="font-bold">User and account</h2>
        <DashboardTop />
      </div>
      <div className="m-2 border p-2">
        <h2 className="font-bold">New Request</h2>
        <DashboardRequire />
      </div>
    </div>
  );
};

export default DashboardPage;
