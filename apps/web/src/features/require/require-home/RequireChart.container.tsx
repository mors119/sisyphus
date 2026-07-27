import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useRequireCountQuery } from '../useRequireQuery.query';
import { RequireStatus, StatusCountResponse } from '../require.types';
import { Loader } from '@/components/custom/Loader';
import { ErrorState } from '@/components/custom/Error';
import { EmptyState } from '@/components/custom/Empty';
import dayjs from 'dayjs';
import { useIsMobile } from '@/hooks/use-mobile';

const chartConfig = {
  received: {
    label: 'Received',
    color: 'var(--warning)',
  },
  inProgress: {
    label: 'InProgress',
    color: 'var(--info)',
  },
  completed: {
    label: 'Completed',
    color: 'var(--success)',
  },
} satisfies ChartConfig;

export function RequireChart() {
  const { data, isLoading, error } = useRequireCountQuery();
  const isMobile = useIsMobile();

  if (isLoading) return <Loader />;
  if (!data) return <EmptyState />;
  if (error) return <ErrorState />;

  // 월별 상태별 카운트를 담을 객체 초기화
  const NUM = isMobile ? 3 : 6;

  const CHARTS = Array.from({ length: NUM }, () => ({
    month: 0,
    received: 0,
    inProgress: 0,
    completed: 0,
  }));

  // 데이터가 로딩된 후, chartData를 업데이트
  if (data) {
    const now = new Date();
    const curMonth1to12 = now.getMonth() + 1; //  1~12

    // 6개월(또는 3개월) 라벨 만들기: (cur-NUM+1) ~ cur
    for (let i = 0; i < NUM; i++) {
      const m = (curMonth1to12 - NUM + 1 + i - 1 + 12) % 12; // 1~12 유지
      CHARTS[i].month = m;
    }

    const keyByStatus: Record<
      RequireStatus,
      'received' | 'inProgress' | 'completed' | undefined
    > = {
      RECEIVED: 'received',
      IN_PROGRESS: 'inProgress',
      COMPLETED: 'completed',
      REJECTED: undefined,
    };

    data.forEach((item: StatusCountResponse) => {
      const key = keyByStatus[item.status];
      if (!key) return;

      // item.month는 1~12라고 가정
      const monthsAgo = (curMonth1to12 - item.month + 12) % 12; // 0..11

      // 이번달 포함 NUM개월만 반영
      if (monthsAgo >= 0 && monthsAgo < NUM) {
        const idx = NUM - 1 - monthsAgo; // ✅ 0..NUM-1
        CHARTS[idx][key] = item.count;
      }
    });
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[180px] max-h-[480px] w-full">
      <BarChart accessibilityLayer data={CHARTS}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(v) => dayjs().month(v).format('MMM')}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="received" fill="var(--color-received)" radius={4} />
        <Bar dataKey="inProgress" fill="var(--color-inProgress)" radius={4} />
        <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
