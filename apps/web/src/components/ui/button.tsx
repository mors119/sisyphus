import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-control text-sm font-medium transition-all duration-[var(--motion-standard)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-focus-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary:
          'bg-action-primary text-on-brand-primary shadow-xs hover:bg-action-primary-hover active:bg-action-primary-active',
        secondary:
          'border border-border bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground',
        ghost:
          'text-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        danger:
          'bg-danger text-white shadow-xs hover:bg-danger/90 focus-visible:ring-danger/20',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        link: 'text-info underline-offset-4 hover:underline',
        default:
          'bg-action-primary text-on-brand-primary shadow-xs hover:bg-action-primary-hover active:bg-action-primary-active',
        destructive:
          'bg-danger text-white shadow-xs hover:bg-danger/90 focus-visible:ring-danger/20',
        sisyphus:
          'duration-[var(--motion-standard)] hover:border-brand-primary hover:bg-action-primary hover:text-on-brand-primary dark:hover:border-brand-accent',
        activeBtn: 'text-info',
      },
      size: {
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        lg: 'h-12 rounded-control px-6 text-base has-[>svg]:px-4',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    loadingLabel?: string;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  loadingLabel,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  const isDisabled = disabled || loading;

  return (
    <Comp
      data-slot="button"
      data-loading={loading ? 'true' : undefined}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}>
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          <span>{loadingLabel ?? children}</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
