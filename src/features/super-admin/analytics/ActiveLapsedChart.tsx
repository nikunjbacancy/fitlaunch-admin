import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { useActiveLapsedTrend } from './useAnalytics'

export function ActiveLapsedChart() {
  const { data, isLoading, isError, refetch } = useActiveLapsedTrend()

  if (isLoading) return <ActiveLapsedChartSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
        <ErrorState
          message="Failed to load active vs lapsed data"
          onRetry={() => {
            void refetch()
          }}
        />
      </div>
    )
  }

  const latest = data?.[data.length - 1]
  const prev = data?.[data.length - 2]

  const activeTrend =
    latest && prev && prev.active > 0 ? ((latest.active - prev.active) / prev.active) * 100 : null
  const lapsedTrend =
    latest && prev && prev.lapsed > 0 ? ((latest.lapsed - prev.lapsed) / prev.lapsed) * 100 : null

  return (
    <div className="rounded-xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      <div className="mb-10">
        <h4 className="text-lg font-bold tracking-tight text-kmvmt-navy">
          Active vs Lapsed Tenants
        </h4>
        <p className="mt-1 text-sm text-kmvmt-navy/50">12-month trend</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#192640', opacity: 0.4, fontWeight: 700 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#192640', opacity: 0.4 }}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: '1px solid #f0f0f0',
              boxShadow: '0 4px 20px rgba(25,38,64,0.08)',
            }}
            cursor={{ stroke: '#192640', strokeWidth: 1, strokeOpacity: 0.1 }}
          />
          <Line
            type="monotone"
            dataKey="active"
            name="Active"
            stroke="#192640"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, fill: '#192640', strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="lapsed"
            name="Lapsed"
            stroke="#9a292c"
            strokeWidth={3}
            strokeDasharray="8 4"
            dot={false}
            activeDot={{ r: 5, fill: '#9a292c', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Summary numbers */}
      <div className="mt-8 flex items-center justify-center gap-12">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-extrabold tracking-tight text-kmvmt-navy tabular-nums">
            {(latest?.active ?? 0).toLocaleString()}
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-kmvmt-navy/40">
              Active
            </p>
            {activeTrend !== null && (
              <p
                className={`text-[10px] font-bold ${activeTrend >= 0 ? 'text-emerald-600' : 'text-kmvmt-red-light'}`}
              >
                {activeTrend >= 0 ? '+' : ''}
                {activeTrend.toFixed(1)}%
              </p>
            )}
          </div>
        </div>
        <div className="h-8 w-px bg-zinc-100" />
        <div className="flex items-center gap-3">
          <span className="text-3xl font-extrabold tracking-tight text-kmvmt-burgundy tabular-nums">
            {(latest?.lapsed ?? 0).toLocaleString()}
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-kmvmt-navy/40">
              Lapsed
            </p>
            {lapsedTrend !== null && (
              <p
                className={`text-[10px] font-bold ${lapsedTrend <= 0 ? 'text-emerald-600' : 'text-kmvmt-red-light'}`}
              >
                {lapsedTrend >= 0 ? '+' : ''}
                {lapsedTrend.toFixed(1)}%
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ActiveLapsedChartSkeleton() {
  return (
    <div className="rounded-xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      <div className="mb-10 space-y-2">
        <Skeleton className="h-5 w-48 rounded" />
        <Skeleton className="h-3.5 w-28 rounded" />
      </div>
      <Skeleton className="h-[220px] w-full rounded-lg" />
      <div className="mt-8 flex justify-center gap-12">
        <Skeleton className="h-10 w-28 rounded" />
        <Skeleton className="h-10 w-28 rounded" />
      </div>
    </div>
  )
}
