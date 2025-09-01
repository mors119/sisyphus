import { PATHS } from '@/app/router/paths.constants';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

export const PolicySidenav = ({ open }: { open: boolean }) => {
  const { t } = useTranslation();
  const location = useLocation();
  if (open)
    return (
      <div className="flex justify-center dark:bg-black md:dark:bg-none">
        <Link
          to={'/' + PATHS.POLICY}
          aria-disabled={location.pathname === '/' + PATHS.POLICY}
          className="flex justify-center items-center gap-2 opacity-80 dark:bg-black md:bg-none">
          <User size={18} />
          <span className="text-xs">{t('policy.termsAPolicy')}</span>
        </Link>
      </div>
    );
};
