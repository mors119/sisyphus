import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

type ResponsivePanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  desktopClassName?: string;
};

export function ResponsivePanel({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  desktopClassName,
}: ResponsivePanelProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className={cn('max-h-[90dvh]', className)}>
          {title || description ? (
            <SheetHeader>
              {title ? <SheetTitle>{title}</SheetTitle> : null}
              {description ? (
                <SheetDescription>{description}</SheetDescription>
              ) : null}
            </SheetHeader>
          ) : null}
          <div className="overflow-y-auto px-1 pb-4">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  if (!open) {
    return null;
  }

  return (
    <aside
      className={cn(
        'rounded-panel border border-border bg-surface p-4 shadow-raised',
        desktopClassName,
        className,
      )}>
      {(title || description) && (
        <header className="mb-4 space-y-1">
          {title ? (
            <h2 className="text-heading-3 font-semibold text-foreground">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </header>
      )}
      {children}
    </aside>
  );
}
