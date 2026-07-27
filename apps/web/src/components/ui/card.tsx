import * as React from 'react';

import { cn } from '@/lib/utils';

const cardVariants = {
  default: 'border bg-card shadow-none',
  interactive:
    'border bg-card shadow-none transition-colors hover:border-brand-primary hover:bg-brand-primary-subtle focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
  selected:
    'border-brand-primary bg-brand-primary-subtle ring-1 ring-inset ring-brand-primary shadow-none',
};

type CardVariant = keyof typeof cardVariants;

function Card({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & { variant?: CardVariant }) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      className={cn(
        'text-card-foreground flex flex-col gap-6 rounded-card py-6',
        cardVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
