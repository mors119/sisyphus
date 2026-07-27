import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { RequireStatus } from '@/features/require/require.types';

const statusSchema = z.object({
  status: z.nativeEnum(RequireStatus),
});

type StatusForm = z.infer<typeof statusSchema>;

type Props = {
  id: number; // role: require id, type: number
  value: RequireStatus; // role: current status, type: RequireStatus
  onChangeStatus: (payload: { id: number; status: RequireStatus }) => void; // role: save handler, type: fn
  className?: string;
};

const statusLabels: Record<RequireStatus, { label: string; cls: string }> = {
  RECEIVED: { label: '접수', cls: 'bg-warning text-white' },
  IN_PROGRESS: { label: '처리 중', cls: 'bg-info text-white' },
  COMPLETED: { label: '완료', cls: 'bg-success text-white' },
  REJECTED: { label: '거절', cls: 'bg-danger text-white' },
};

export function RequireStatusSelect({
  id,
  value,
  onChangeStatus,
  className,
}: Props) {
  const form = useForm<StatusForm>({
    resolver: zodResolver(statusSchema),
    defaultValues: { status: value },
    mode: 'onChange',
  });

  // 외부 값이 바뀌면(리스트 refetch 등) 폼도 동기화
  useEffect(() => {
    form.reset({ status: value });
  }, [value, form]);

  return (
    <span
      role="button"
      onClick={(e) => e.stopPropagation()}
      className={cn('inline-flex items-center', className)}>
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => {
              const meta = statusLabels[field.value];

              return (
                <FormItem>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        const next = v as RequireStatus;
                        field.onChange(next);

                        // ✅ 바뀐 즉시 저장(원하면 confirm 버튼 방식으로 바꿀 수도 있음)
                        if (next !== value) {
                          onChangeStatus({ id, status: next });
                        }
                      }}>
                      {/* Trigger를 "뱃지"처럼 보이게 */}
                      <SelectTrigger
                        className={cn(
                          'h-7 px-2 py-1 text-xs border-0 shadow-none focus:ring-0 focus:ring-offset-0',
                          'rounded',
                          meta.cls,
                        )}>
                        <SelectValue placeholder="상태" />
                      </SelectTrigger>

                      <SelectContent>
                        {(
                          Object.keys(statusLabels) as Array<RequireStatus>
                        ).map((k) => (
                          <SelectItem key={k} value={k}>
                            {statusLabels[k].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              );
            }}
          />
        </form>
      </Form>
    </span>
  );
}
