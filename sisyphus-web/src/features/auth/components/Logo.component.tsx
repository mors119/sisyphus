import { Link, useLocation } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PATHS } from '@/app/router/paths.constants';
import { useTranslation } from 'react-i18next';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = '' }: LogoProps) => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className={className}>
      <Tooltip>
        <div className="h-full min-w-14  rounded-md flex justify-center items-center hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
          <TooltipTrigger>
            <Link to="/" className="flex items-center justify-center relative">
              <img
                src="/logo/diagram-logo.png"
                alt="diagram logo"
                className="p-0.5 h-12"
              />
              <img
                src="/logo/text-logo.png"
                alt="text logo"
                className=" absolute mt-4"
              />
            </Link>
          </TooltipTrigger>
        </div>
        {location.pathname !== PATHS.HOME && (
          <TooltipContent>
            <p>{t('auth.backToHome')}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </div>
  );
};
