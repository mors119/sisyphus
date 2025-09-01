import { Loader } from 'lucide-react';
import { useUserAndAccount } from '../useDashboardQuery.query';
import { ErrorState } from '@/components/custom/Error';

export const DashboardTop = () => {
  const { data, isLoading, isError } = useUserAndAccount();

  if (isLoading) return <Loader className="h-4 w-4 animate-spin" />;
  if (isError || !data) return <ErrorState />;

  return (
    <div className="grid grid-cols-2 gap-4 p-2">
      <div className="rounded-xl border p-4">
        <div className="text-sm text-muted-foreground">Users</div>
        <div className="text-2xl font-semibold">{data.userCount}</div>
      </div>
      <div className="rounded-xl border p-4">
        <div className="text-sm text-muted-foreground">Accounts</div>
        <div className="text-2xl font-semibold">{data.accountCount}</div>
      </div>
    </div>
  );
};
