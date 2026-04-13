import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { usePlatformAnalytics } from './useAnalytics'

export function DashboardCharts() {
  const { data, isLoading, isError, refetch } = usePlatformAnalytics()

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
          message="Failed to load tenant growth"
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
        Tenant Growth by Type
      </p>
      <p className="mb-4 mt-0.5 text-xs text-kmvmt-navy/50">Apartments vs Trainers</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={data?.tenantGrowth ?? []}
          margin={{ top: 4, right: 16, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="dashApartmentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#192640" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#192640" stopOpacity={0.04} />
            </linearGradient>
            <linearGradient id="dashTrainerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9a292c" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#9a292c" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={32} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e4e4e7' }} />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            formatter={(value) => (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="apartment"
            name="Apartment"
            stroke="#192640"
            strokeWidth={2.5}
            fill="url(#dashApartmentGradient)"
          />
          <Area
            type="monotone"
            dataKey="trainer"
            name="Trainer"
            stroke="#9a292c"
            strokeWidth={2.5}
            fill="url(#dashTrainerGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
