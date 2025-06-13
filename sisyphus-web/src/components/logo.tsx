import { Link, useLocation } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = '' }: LogoProps) => {
  const location = useLocation();

  return (
    <div className={className}>
      <Tooltip>
        <div className="h-full min-w-14  rounded-md flex justify-center items-center hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
          <TooltipTrigger>
            <Link to="/" className="flex items-center justify-center relative">
              <img
                src="diagram-logo.png"
                alt="diagram logo"
                className="p-0.5 h-12"
              />
              <img
                src="text-logo.png"
                alt="text logo"
                className=" absolute mt-4"
              />
            </Link>
          </TooltipTrigger>
        </div>
        {location.pathname !== '/' && (
          <TooltipContent>
            <p>Back to Home</p>
          </TooltipContent>
        )}
      </Tooltip>
    </div>
  );
};
