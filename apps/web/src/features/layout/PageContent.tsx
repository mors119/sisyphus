import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const pageContentVariants = cva('mx-auto w-full', {
  variants: {
    width: {
      narrow: 'max-w-[var(--content-narrow)]',
      medium: 'max-w-[var(--content-medium)]',
      wide: 'max-w-[var(--content-wide)]',
      full: 'max-w-full',
    },
  },
  defaultVariants: {
    width: 'wide',
  },
});

type PageContentProps = React.ComponentProps<'div'> &
  VariantProps<typeof pageContentVariants>;

export function PageContent({
  className,
  width,
  ...props
}: PageContentProps) {
  return (
    <div className={cn(pageContentVariants({ width }), className)} {...props} />
  );
}
