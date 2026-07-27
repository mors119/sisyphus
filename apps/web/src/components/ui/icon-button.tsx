import * as React from 'react';

import { Button, type buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';

type IconButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    label: string;
    tooltip?: string;
    tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  };

export function IconButton({
  label,
  tooltip,
  tooltipSide = 'bottom',
  className,
  children,
  ...props
}: IconButtonProps) {
  const button = (
    <Button
      type="button"
      size="icon"
      aria-label={label}
      className={cn(className)}
      {...props}>
      {children}
    </Button>
  );

  if (!tooltip) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
