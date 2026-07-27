import { cn } from '@/lib/utils';

import { ProgressStep, type StepState } from './progress-step';

export type ProgressListItem = {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  state: StepState;
  action?: React.ReactNode;
};

type ProgressListProps = {
  items: ProgressListItem[];
  className?: string;
  label?: string;
};

export function ProgressList({
  items,
  className,
  label = 'Progress',
}: ProgressListProps) {
  return (
    <ol
      aria-label={label}
      className={cn('flex flex-col gap-3', className)}>
      {items.map((item) => (
        <ProgressStep
          key={item.id}
          title={item.title}
          description={item.description}
          state={item.state}
          action={item.action}
        />
      ))}
    </ol>
  );
}

export type { StepState };
