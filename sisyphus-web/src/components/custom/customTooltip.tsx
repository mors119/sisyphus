import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface Props {
  children: React.ReactNode;
  content: string;
  location?: 'bottom' | 'top' | 'right' | 'left';
  className?: string;
}

export const CustomTooltip = ({
  children,
  content,
  location = 'bottom',
  className,
}: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className={className} side={location}>
        {content}
      </TooltipContent>
    </Tooltip>
  );
};
