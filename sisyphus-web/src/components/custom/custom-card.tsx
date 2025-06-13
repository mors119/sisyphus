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
  className?: string;
  title?: React.ReactNode | string;
  description?: React.ReactNode | string;
  content?: React.ReactNode | string;
  footer?: React.ReactNode | string;
}

export const CustomCard = ({
  className,
  title,
  description,
  content,
  footer,
}: CustomCardProps) => {
  return (
    <Card
      className={cn(
        'border-2 group rounded-md h-full overflow-auto shadow',
        className,
      )}>
      <CardHeader className="space-y-1 w-full">
        {title && (
          <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-[#1186ce] transition-colors duration-300">
            {title}
          </CardTitle>
        )}
        {description && (
          <CardDescription className="text-sm text-gray-500">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      {content && (
        <CardContent className="px-6 text-sm text-gray-700 leading-relaxed">
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
