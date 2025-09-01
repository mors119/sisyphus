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

const chartConfig = {
  received: {
    label: 'Received',
    color: '#ffcd49',
  },
  inProgress: {
    label: 'InProgress',
    color: '#11cd49',
  },
  completed: {
    label: 'Completed',
    color: '#1186ce',
  },
} satisfies ChartConfig;

export function RequireChart() {
  const { data, isLoading, error } = useRequireCountQuery();

  if (isLoading) return <Loader />;
  if (!data) return <EmptyState />;
  if (error) return <ErrorState />;

  // 월별 상태별 카운트를 담을 객체 초기화
  const chartData = [
    { month: 1, received: 0, inProgress: 0, completed: 0 },
    { month: 1, received: 0, inProgress: 0, completed: 0 },
    { month: 1, received: 0, inProgress: 0, completed: 0 },
    { month: 1, received: 0, inProgress: 0, completed: 0 },
    { month: 1, received: 0, inProgress: 0, completed: 0 },
    { month: 1, received: 0, inProgress: 0, completed: 0 },
  ];

  // 데이터가 로딩된 후, chartData를 업데이트
  if (data) {
    const now = new Date();
    const curMonth1to12 = now.getMonth() + 1; // 1~12

    const n = 6;

    for (let i = 0; i < n; i++) {
      chartData[i].month = (curMonth1to12 - n + 1 + 12 + i) % 12;
    }

    const keyByStatus: Record<
      RequireStatus,
      'received' | 'inProgress' | 'completed' | undefined
    > = {
      RECEIVED: 'received',
      IN_PROGRESS: 'inProgress',
      COMPLETED: 'completed',
      REJECTED: undefined, // 필요 없으면 무시
    };

    data.forEach((item: StatusCountResponse) => {
      const monthsAgo = (curMonth1to12 - item.month + 12) % 12;
      if (monthsAgo >= 1 && monthsAgo <= n) {
        const idx = n - monthsAgo - 1; // 0~5
        const key = keyByStatus[item.status as RequireStatus];
        if (key) {
          chartData[idx][key] = item.count;
        }
      }
    });
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[180px] max-h-[480px] w-full">
      <BarChart accessibilityLayer data={chartData}>
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
