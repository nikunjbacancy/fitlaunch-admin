import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
import { useLocationComparison } from './useLocations'
import { LOCATIONS_COPY } from './constants'

export function LocationComparison() {
  const { data, isLoading, isError, refetch } = useLocationComparison()

  if (isError) {
    return (
      <ErrorState
        title={LOCATIONS_COPY.COMPARISON_ERROR}
        description={LOCATIONS_COPY.ERROR_LOAD_DESC}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (isLoading) {
    return <DataTableSkeleton columns={4} rows={5} />
  }

  const locations = data?.locations ?? []

  if (locations.length < 2) {
    return (
      <EmptyState title={LOCATIONS_COPY.COMPARISON_EMPTY} description={LOCATIONS_COPY.EMPTY_DESC} />
    )
  }

  const chartData = locations.map((loc) => ({
    name: loc.locationName,
    [LOCATIONS_COPY.METRIC_MEMBERS]: loc.memberCount,
    [LOCATIONS_COPY.METRIC_ACTIVE]: loc.activeThisWeek,
    [LOCATIONS_COPY.METRIC_MRR]: loc.mrr,
  }))

  return (
    <div className="space-y-8">
      {/* Members & Active chart */}
      <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
        <div className="flex items-start justify-between px-8 py-7">
          <div>
            <h4 className="text-xl font-extrabold tracking-tight text-kmvmt-navy">
              {LOCATIONS_COPY.METRIC_MEMBERS} &amp; {LOCATIONS_COPY.METRIC_ACTIVE}
            </h4>
            <p className="mt-1 text-sm text-kmvmt-navy/50">
              {LOCATIONS_COPY.COMPARISON_DESCRIPTION}
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-kmvmt-navy/60">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-kmvmt-navy" />
              {LOCATIONS_COPY.METRIC_MEMBERS}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-kmvmt-blue-light" />
              {LOCATIONS_COPY.METRIC_ACTIVE}
            </span>
          </div>
        </div>
        <div className="px-8 pb-8">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
              barCategoryGap="25%"
            >
              <defs>
                <linearGradient id="membersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#192640" stopOpacity={1} />
                  <stop offset="100%" stopColor="#192640" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7ca3d1" stopOpacity={1} />
                  <stop offset="100%" stopColor="#7ca3d1" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e4e4e7' }}
              />
              <Bar
                dataKey={LOCATIONS_COPY.METRIC_MEMBERS}
                fill="url(#membersGrad)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey={LOCATIONS_COPY.METRIC_ACTIVE}
                fill="url(#activeGrad)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MRR chart */}
      <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
        <div className="px-8 py-7">
          <h4 className="text-xl font-extrabold tracking-tight text-kmvmt-navy">
            {LOCATIONS_COPY.METRIC_MRR}
          </h4>
          <p className="mt-1 text-sm text-kmvmt-navy/50">Monthly recurring revenue by location</p>
        </div>
        <div className="px-8 pb-8">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
              barCategoryGap="35%"
            >
              <defs>
                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#192640" stopOpacity={1} />
                  <stop offset="100%" stopColor="#192640" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={44} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e4e4e7' }}
              />
              <Bar dataKey={LOCATIONS_COPY.METRIC_MRR} fill="url(#mrrGrad)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
