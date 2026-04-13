import { MoreHorizontal } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { usePlatformAnalytics } from './useAnalytics'

export function MrrChart() {
  const { data, isLoading, isError, refetch } = usePlatformAnalytics()

  if (isLoading) return <MrrChartSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
        <ErrorState
          message="Failed to load MRR trend"
          onRetry={() => {
            void refetch()
          }}
        />
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h4 className="text-lg font-bold tracking-tight text-kmvmt-navy">MRR Trend</h4>
          <p className="mt-1 text-sm text-kmvmt-navy/50">
            Monthly Recurring Revenue over last 6 months
          </p>
        </div>
        <button
          aria-label="More options"
          className="rounded-lg p-1.5 text-kmvmt-navy/30 transition-colors hover:bg-kmvmt-bg hover:text-kmvmt-navy"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data?.mrrTrend ?? []} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="mrrGradientFull" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#192640" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#192640" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#192640', opacity: 0.4, fontWeight: 700 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: '#192640', opacity: 0.4 }}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, 'MRR']}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: '1px solid #f0f0f0',
              boxShadow: '0 4px 20px rgba(25,38,64,0.08)',
            }}
            cursor={{ stroke: '#192640', strokeWidth: 1, strokeOpacity: 0.1 }}
          />
          <Area
            type="monotone"
            dataKey="mrr"
            stroke="#192640"
            strokeWidth={3}
            fill="url(#mrrGradientFull)"
            dot={false}
            activeDot={{ r: 5, fill: '#192640', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function MrrChartSkeleton() {
  return (
    <div className="rounded-xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      <div className="mb-10 flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-28 rounded" />
          <Skeleton className="h-3.5 w-52 rounded" />
        </div>
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-[260px] w-full rounded-lg" />
    </div>
  )
}
