import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { usePlatformAnalytics } from './useAnalytics'

export function TenantGrowthChart() {
  const { data, isLoading, isError, refetch } = usePlatformAnalytics()

  if (isLoading) return <TenantGrowthChartSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
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
    <div className="rounded-xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h4 className="text-lg font-bold tracking-tight text-kmvmt-navy">
            Tenant Growth by Type
          </h4>
          <p className="mt-1 text-sm text-kmvmt-navy/50">Apartments vs. Trainers &amp; Gyms</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-kmvmt-navy">
            <span className="h-2.5 w-2.5 rounded-full bg-kmvmt-navy" />
            Apartments
          </span>
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-kmvmt-burgundy">
            <span className="h-2.5 w-2.5 rounded-full bg-kmvmt-burgundy" />
            Trainers
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={data?.tenantGrowth ?? []}
          margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="apartmentGradFull" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#192640" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#192640" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="trainerGradFull" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9a292c" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#9a292c" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            width={32}
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
          <Area
            type="monotone"
            dataKey="apartment"
            name="Apartment"
            stroke="#192640"
            strokeWidth={2.5}
            fill="url(#apartmentGradFull)"
            dot={false}
            activeDot={{ r: 4, fill: '#192640', strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="trainer"
            name="Trainer"
            stroke="#9a292c"
            strokeWidth={2.5}
            fill="url(#trainerGradFull)"
            dot={false}
            activeDot={{ r: 4, fill: '#9a292c', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function TenantGrowthChartSkeleton() {
  return (
    <div className="rounded-xl bg-kmvmt-white p-8 shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      <div className="mb-10 flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-44 rounded" />
          <Skeleton className="h-3.5 w-40 rounded" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-[260px] w-full rounded-lg" />
    </div>
  )
}
