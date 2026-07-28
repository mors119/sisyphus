import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CustomCardProps {
  onClick?: () => void;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  title?: React.ReactNode | string;
  description?: React.ReactNode | string;
  content?: React.ReactNode | string;
  footer?: React.ReactNode | string;
  selected?: boolean;
  interactive?: boolean;
}

export const CustomCard = ({
  onClick,
  className,
  contentClassName,
  headerClassName,
  title,
  description,
  content,
  footer,
  selected = false,
  interactive = Boolean(onClick),
}: CustomCardProps) => {
  const variant = selected ? 'selected' : interactive ? 'interactive' : 'default';

  return (
    <Card
      onClick={onClick}
      variant={variant}
      className={cn('h-full overflow-auto', className)}>
      {(title || description) && (
        <CardHeader
          className={cn('w-full space-y-1 px-0 pt-0', headerClassName)}>
          {title ? (
            <CardTitle className="text-lg font-semibold text-foreground">
              {title}
            </CardTitle>
          ) : null}
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </CardHeader>
      )}
      {content ? (
        <CardContent
          className={cn('px-0 text-sm leading-relaxed text-foreground', contentClassName)}>
          {content}
        </CardContent>
      ) : null}
      {footer ? (
        <CardFooter className="mt-2 px-0 pb-0 text-sm text-muted-foreground">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
};
