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
import { useEngagement } from './usePmDashboard'
import { DASHBOARD_COPY } from './constants'

export function EngagementChart() {
  const { data, isLoading, isError, refetch } = useEngagement()

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-kmvmt-white p-5">
        <Skeleton className="mb-4 h-4 w-40" />
        <Skeleton className="h-[220px] w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-kmvmt-white p-5">
        <ErrorState
          title={DASHBOARD_COPY.CHART_ERROR}
          description={DASHBOARD_COPY.CHART_EMPTY}
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
        {DASHBOARD_COPY.CHART_TITLE}
      </p>
      <p className="mb-4 mt-0.5 text-xs text-kmvmt-navy/50">Active users vs workout sessions</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="activeGradPm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#192640" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#192640" stopOpacity={0.04} />
            </linearGradient>
            <linearGradient id="workoutsGradPm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7ca3d1" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#7ca3d1" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e4e4e7' }} />
          <Area
            type="monotone"
            dataKey="activeUsers"
            name={DASHBOARD_COPY.CHART_SERIES_ACTIVE}
            stroke="#192640"
            strokeWidth={2.5}
            fill="url(#activeGradPm)"
            dot={false}
            activeDot={{ r: 5, fill: '#192640' }}
          />
          <Area
            type="monotone"
            dataKey="workouts"
            name={DASHBOARD_COPY.CHART_SERIES_WORKOUTS}
            stroke="#7ca3d1"
            strokeWidth={2.5}
            fill="url(#workoutsGradPm)"
            dot={false}
            activeDot={{ r: 5, fill: '#7ca3d1' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
