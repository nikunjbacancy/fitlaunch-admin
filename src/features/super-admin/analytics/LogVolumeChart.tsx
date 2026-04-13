import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { useLogVolumeTrend } from './useAnalytics'

export function LogVolumeChart() {
  const { data, isLoading, isError, refetch } = useLogVolumeTrend()

  if (isLoading) return <LogVolumeChartSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
        <ErrorState
          message="Failed to load log volume data"
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
          Workout + Meal Log Volume
        </h4>
        <p className="mt-1 text-sm text-kmvmt-navy/50">Monthly platform-wide counts</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
          barCategoryGap="30%"
          barGap={3}
        >
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#192640', opacity: 0.4, fontWeight: 700 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
            tick={{ fontSize: 11, fill: '#192640', opacity: 0.4 }}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <Tooltip
            formatter={(value) => [Number(value).toLocaleString(), '']}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: '1px solid #f0f0f0',
              boxShadow: '0 4px 20px rgba(25,38,64,0.08)',
            }}
            cursor={{ fill: 'rgba(25,38,64,0.03)' }}
          />
          <Bar
            dataKey="workoutLogs"
            name="Workout Logs"
            fill="#192640"
            fillOpacity={0.9}
            radius={[3, 3, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            dataKey="mealLogs"
            name="Meal Logs"
            fill="#9a292c"
            fillOpacity={0.85}
            radius={[3, 3, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6">
        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-kmvmt-navy/60">
          <span className="h-2.5 w-2.5 rounded-full bg-kmvmt-navy" />
          Workouts
        </span>
        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-kmvmt-navy/60">
          <span className="h-2.5 w-2.5 rounded-full bg-kmvmt-burgundy" />
          Meal Logs
        </span>
      </div>
    </div>
  )
}

function LogVolumeChartSkeleton() {
  return (
    <div className="rounded-xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      <div className="mb-10 space-y-2">
        <Skeleton className="h-5 w-48 rounded" />
        <Skeleton className="h-3.5 w-40 rounded" />
      </div>
      <Skeleton className="h-[220px] w-full rounded-lg" />
      <div className="mt-6 flex gap-6">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>
    </div>
  )
}
