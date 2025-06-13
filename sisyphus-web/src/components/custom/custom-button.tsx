import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent } from '../ui/tooltip';
import { Eraser, Pencil, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  message?: string;
  size?: number;
  tip?: boolean;
}
export const EditBtn = ({
  className,
  onClick,
  message,
  size,
  tip = true,
}: ButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'ml-auto text-blue-500 hover:text-white hover:bg-blue-500 p-1',
            className,
          )}
          onClick={onClick}>
          <Pencil size={size} />
        </Button>
      </TooltipTrigger>
      {tip && <TooltipContent>{message || 'edit'}</TooltipContent>}
    </Tooltip>
  );
};
export const DeleteBtn = ({
  className,
  onClick,
  message,
  size,
  tip = true,
}: ButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'ml-auto text-red-500 hover:text-white hover:bg-red-500 p-1',
            className,
          )}
          onClick={onClick}>
          <Trash2 size={size} />
        </Button>
      </TooltipTrigger>
      {tip && <TooltipContent>{message || 'delete'}</TooltipContent>}
    </Tooltip>
  );
};

export const CloseBtn = ({
  className,
  onClick,
  message,
  size,
  tip = true,
}: ButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'ml-auto text-black hover:text-white hover:bg-black p-1',
            className,
          )}
          onClick={onClick}>
          <X size={size} />
        </Button>
      </TooltipTrigger>
      {tip && <TooltipContent>{message || 'close'}</TooltipContent>}
    </Tooltip>
  );
};

export const CleanBtn = ({
  className,
  onClick,
  message,
  size,
  tip = true,
}: ButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'ml-auto text-black hover:text-blue-500 p-1 hover:bg-color-none duration-500',
            className,
          )}
          onClick={onClick}>
          <Eraser size={size} />
        </Button>
      </TooltipTrigger>
      {tip && <TooltipContent>{message || 'clean'}</TooltipContent>}
    </Tooltip>
  );
};
