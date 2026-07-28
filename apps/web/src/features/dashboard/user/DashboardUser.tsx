import { Loader } from 'lucide-react';
import { useUserAndAccount } from '../useDashboardQuery.query';
import { ErrorState } from '@/components/custom/Error';

export const DashboardTop = () => {
  const { data, isLoading, isError } = useUserAndAccount();

  if (isLoading) return <Loader className="h-4 w-4 animate-spin" />;
  if (isError || !data) return <ErrorState />;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="rounded-[var(--radius-role-card)] border border-border p-6">
        <div className="text-sm text-muted-foreground">Users</div>
        <div className="text-heading-2 font-semibold text-foreground">
          {data.userCount}
        </div>
      </div>
      <div className="rounded-[var(--radius-role-card)] border border-border p-6">
        <div className="text-sm text-muted-foreground">Accounts</div>
        <div className="text-heading-2 font-semibold text-foreground">
          {data.accountCount}
        </div>
      </div>
    </div>
  );
};
