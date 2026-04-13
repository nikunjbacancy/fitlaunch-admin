import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { useOwnerMrrTrend } from './useOwnerDashboard'
import { OWNER_DASHBOARD_COPY } from './constants'

/**
 * MRR Trend mini-chart (CO #3).
 * SA-style bordered chart card with a 6-month area chart.
 */
export function MrrTrendChart() {
  const { data, isLoading, isError, refetch } = useOwnerMrrTrend()

  const totalCurrent = data && data.length > 0 ? (data[data.length - 1]?.mrr ?? 0) : 0

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-kmvmt-white p-5">
        <Skeleton className="mb-4 h-4 w-32" />
        <Skeleton className="mb-4 h-8 w-24" />
        <Skeleton className="h-[160px] w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-kmvmt-white p-5">
        <ErrorState
          title={OWNER_DASHBOARD_COPY.MRR_TREND_ERROR}
          description={OWNER_DASHBOARD_COPY.MRR_TREND_EMPTY}
          onRetry={() => {
            void refetch()
          }}
        />
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-kmvmt-white p-5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
        {OWNER_DASHBOARD_COPY.SECTION_MRR_TREND}
      </p>
      <p className="mt-2 text-4xl font-black tracking-tight text-kmvmt-navy tabular-nums">
        ${totalCurrent.toLocaleString()}
      </p>
      <p className="mb-4 text-xs text-kmvmt-navy/40">{OWNER_DASHBOARD_COPY.MRR_TREND_SUBTITLE}</p>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="ownerMrrGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#192640" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#192640" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e4e4e7' }}
            formatter={(value) => `$${Number(value).toLocaleString()}`}
          />
          <Area
            type="monotone"
            dataKey="mrr"
            name="MRR"
            stroke="#192640"
            strokeWidth={2.5}
            fill="url(#ownerMrrGradient)"
            dot={false}
            activeDot={{ r: 5, fill: '#192640' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
