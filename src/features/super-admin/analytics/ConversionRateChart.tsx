import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { useConversionRateTrend } from './useAnalytics'

export function ConversionRateChart() {
  const { data, isLoading, isError, refetch } = useConversionRateTrend()

  if (isLoading) return <ConversionRateChartSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
        <ErrorState
          message="Failed to load conversion data"
          onRetry={() => {
            void refetch()
          }}
        />
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      <div className="mb-10">
        <h4 className="text-lg font-bold tracking-tight text-kmvmt-navy">
          Trial → Paid Conversion Rate
        </h4>
        <p className="mt-1 text-sm text-kmvmt-navy/50">Target Benchmark: 25%</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#192640', opacity: 0.4, fontWeight: 700 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v: number) => `${String(v)}%`}
            tick={{ fontSize: 11, fill: '#192640', opacity: 0.4 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            formatter={(value) => [`${String(value)}%`, 'Conversion Rate']}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: '1px solid #f0f0f0',
              boxShadow: '0 4px 20px rgba(25,38,64,0.08)',
            }}
            cursor={{ stroke: '#192640', strokeWidth: 1, strokeOpacity: 0.1 }}
          />
          <ReferenceLine
            y={25}
            stroke="#e4e4e7"
            strokeDasharray="5 4"
            label={{ value: '25%', position: 'right', fontSize: 10, fill: '#192640', opacity: 0.4 }}
          />
          <Line
            type="monotone"
            dataKey="rate"
            name="Conversion Rate"
            stroke="#192640"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, fill: '#192640', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function ConversionRateChartSkeleton() {
  return (
    <div className="rounded-xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      <div className="mb-10 space-y-2">
        <Skeleton className="h-5 w-52 rounded" />
        <Skeleton className="h-3.5 w-36 rounded" />
      </div>
      <Skeleton className="h-[260px] w-full rounded-lg" />
    </div>
  )
}
