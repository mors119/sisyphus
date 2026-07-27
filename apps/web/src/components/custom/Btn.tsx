import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent } from '../ui/tooltip';
import { CircleQuestionMark, Eraser, Pencil, Trash2, X } from 'lucide-react';
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
          aria-label={message || t('edit')}
          className={cn(
            'ml-auto p-1 text-info hover:bg-action-primary hover:text-on-brand-primary',
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
          aria-label={message || t('delete')}
          className={cn(
            'ml-auto p-1 text-danger hover:bg-danger hover:text-white',
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
          aria-label={message || t('close')}
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
          aria-label={message || t('clean')}
          className={cn(
            'ml-auto p-1 text-black duration-[var(--motion-standard)] hover:text-info dark:text-white dark:hover:bg-gray-700',
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

export const QuestionBtn = ({
  className = 'cursor-pointer text-warning',
  location = 'bottom',
  message,
  size = 16,
  tip = true,
}: ButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger aria-label={message || 'Help'}>
        <CircleQuestionMark size={size} className={className} />
      </TooltipTrigger>
      {tip && <TooltipContent side={location}>{message}</TooltipContent>}
    </Tooltip>
  );
};
