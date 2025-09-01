import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent } from '../ui/tooltip';
import { Eraser, Pencil, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ButtonProps {
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  message?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  size?: number;
  tip?: boolean;
  location?: 'bottom' | 'top' | 'right' | 'left' | undefined;
  disabled?: boolean;
}
export const EditBtn = ({
  className,
  onClick,
  message,
  size,
  type = 'button',
  tip = true,
  location = 'bottom',
  disabled = false,
}: ButtonProps) => {
  const { t } = useTranslation();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type={type}
          variant="ghost"
          size="icon"
          disabled={disabled}
          className={cn(
            'ml-auto text-blue-500 hover:text-white hover:bg-blue-500 p-1',
            className,
          )}
          onClick={onClick}>
          <Pencil size={size} />
        </Button>
      </TooltipTrigger>
      {tip && (
        <TooltipContent side={location}>{message || t('edit')}</TooltipContent>
      )}
    </Tooltip>
  );
};
export const DeleteBtn = ({
  className,
  onClick,
  message,
  size,
  type = 'button',
  tip = true,
  location = 'bottom',
  disabled = false,
}: ButtonProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type={type}
          variant="ghost"
          size="icon"
          disabled={disabled}
          className={cn(
            'ml-auto text-red-500 hover:text-white hover:bg-red-500 p-1',
            className,
          )}
          onClick={onClick}>
          <Trash2 size={size} />
        </Button>
      </TooltipTrigger>
      {tip && (
        <TooltipContent side={location}>
          {message || t('delete')}
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export const CloseBtn = ({
  className,
  onClick,
  message,
  size,
  type = 'button',
  tip = true,
  location = 'bottom',
  disabled = false,
}: ButtonProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type={type}
          variant="ghost"
          size="icon"
          disabled={disabled}
          className={cn(
            'ml-auto text-black hover:text-white hover:bg-black p-1 dark:text-white dark:bg-none',
            className,
          )}
          onClick={onClick}>
          <X size={size} />
        </Button>
      </TooltipTrigger>
      {tip && (
        <TooltipContent side={location}>{message || t('close')}</TooltipContent>
      )}
    </Tooltip>
  );
};

export const CleanBtn = ({
  className,
  onClick,
  message,
  size,
  type = 'button',
  tip = true,
  location = 'bottom',
  disabled = false,
}: ButtonProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type={type}
          variant="ghost"
          size="icon"
          disabled={disabled}
          className={cn(
            'ml-auto text-black hover:text-blue-500 p-1 hover:bg-color-none duration-500 dark:text-white dark:hover:bg-gray-700',
            className,
          )}
          onClick={onClick}>
          <Eraser size={size} />
        </Button>
      </TooltipTrigger>
      {tip && (
        <TooltipContent side={location}>{message || t('clean')}</TooltipContent>
      )}
    </Tooltip>
  );
};
