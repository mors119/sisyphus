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
  title?: React.ReactNode | string;
  description?: React.ReactNode | string;
  content?: React.ReactNode | string;
  footer?: React.ReactNode | string;
}

export const CustomCard = ({
  onClick,
  className,
  title,
  description,
  content,
  footer,
}: CustomCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'border-2 rounded-md h-full overflow-auto shadow dark:bg-black ',
        className,
      )}>
      <CardHeader className="space-y-1 w-full">
        {title && (
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white ">
            {title}
          </CardTitle>
        )}
        {description && (
          <CardDescription className="text-sm text-gray-500 dark:text-white">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      {content && (
        <CardContent className="px-6 text-sm text-gray-700 leading-relaxed dark:text-white">
          {content}
        </CardContent>
      )}
      {footer && (
        <CardFooter className="text-sm text-gray-400 mt-2 mr-2">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};
