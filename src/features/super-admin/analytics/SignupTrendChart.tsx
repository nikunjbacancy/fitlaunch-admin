import { BarChart, Bar, Cell, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { useSignupTrend } from './useAnalytics'

export function SignupTrendChart() {
  const { data, isLoading, isError, refetch } = useSignupTrend()

  if (isLoading) return <SignupTrendChartSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
        <ErrorState
          message="Failed to load signup trend"
          onRetry={() => {
            void refetch()
          }}
        />
      </div>
    )
  }

  const maxSignups = Math.max(...(data?.map((d) => d.signups) ?? [0]))

  return (
    <div className="rounded-xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      <div className="mb-10">
        <h4 className="text-lg font-bold tracking-tight text-kmvmt-navy">New Signups per Month</h4>
        <p className="mt-1 text-sm text-kmvmt-navy/50">12-month trend</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 24, right: 4, bottom: 0, left: 0 }}
          barCategoryGap="35%"
        >
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#192640', opacity: 0.4, fontWeight: 700 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value) => [Number(value).toLocaleString(), 'Signups']}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: '1px solid #f0f0f0',
              boxShadow: '0 4px 20px rgba(25,38,64,0.08)',
            }}
            cursor={{ fill: 'rgba(25,38,64,0.03)' }}
          />
          <Bar
            dataKey="signups"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
            label={{
              position: 'top',
              fontSize: 10,
              fontWeight: 700,
              fill: '#192640',
              formatter: (v: number) => (v === maxSignups ? v : ''),
            }}
          >
            {data?.map((entry, index) => (
              // eslint-disable-next-line @typescript-eslint/no-deprecated
              <Cell
                key={`cell-${String(index)}`}
                fill={entry.signups === maxSignups ? '#192640' : '#e8ecf0'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function SignupTrendChartSkeleton() {
  return (
    <div className="rounded-xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      <div className="mb-10 space-y-2">
        <Skeleton className="h-5 w-44 rounded" />
        <Skeleton className="h-3.5 w-28 rounded" />
      </div>
      <Skeleton className="h-[260px] w-full rounded-lg" />
    </div>
  )
}
