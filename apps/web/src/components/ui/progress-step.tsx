import {
  CheckCircle2,
  Circle,
  CircleDashed,
  CircleSlash,
  Loader2,
  XCircle,
} from 'lucide-react';

import { cn } from '@/lib/utils';

export type StepState =
  | 'pending'
  | 'active'
  | 'completed'
  | 'failed'
  | 'skipped';

const stepIcons: Record<StepState, React.ReactNode> = {
  pending: <Circle className="size-4 text-muted-foreground" aria-hidden="true" />,
  active: (
    <Loader2
      className="size-4 motion-reduce:animate-none animate-spin text-info"
      aria-hidden="true"
    />
  ),
  completed: (
    <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
  ),
  failed: <XCircle className="size-4 text-danger" aria-hidden="true" />,
  skipped: (
    <CircleSlash className="size-4 text-muted-foreground" aria-hidden="true" />
  ),
};

type ProgressStepProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  state: StepState;
  action?: React.ReactNode;
  className?: string;
};

export function ProgressStep({
  title,
  description,
  state,
  action,
  className,
}: ProgressStepProps) {
  return (
    <li
      aria-current={state === 'active' ? 'step' : undefined}
      className={cn(
        'flex items-start gap-3 rounded-control border border-border bg-surface px-4 py-3',
        state === 'active' && 'border-brand-primary bg-brand-primary-subtle',
        state === 'failed' && 'border-danger/40 bg-danger-subtle',
        className,
      )}>
      <span className="mt-0.5 shrink-0">{stepIcons[state]}</span>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
        {action ? <div>{action}</div> : null}
      </div>
    </li>
  );
}

export function ProgressStepPlaceholder({ className }: { className?: string }) {
  return (
    <CircleDashed
      className={cn('size-4 text-muted-foreground', className)}
      aria-hidden="true"
    />
  );
}
