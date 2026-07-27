import { cn } from '@/lib/utils';

export function PageLayout({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'mx-auto flex w-full flex-col gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8',
        className,
      )}
      {...props}
    />
  );
}
