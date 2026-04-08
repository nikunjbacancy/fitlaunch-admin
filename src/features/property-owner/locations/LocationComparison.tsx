import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { PageHeader } from '@/components/shared/PageHeader'
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
      <div className="space-y-6">
        <PageHeader
          title={LOCATIONS_COPY.COMPARISON_TITLE}
          description={LOCATIONS_COPY.COMPARISON_DESCRIPTION}
        />
        <EmptyState
          title={LOCATIONS_COPY.COMPARISON_EMPTY}
          description={LOCATIONS_COPY.EMPTY_DESC}
        />
      </div>
    )
  }

  const chartData = locations.map((loc) => ({
    name: loc.locationName,
    [LOCATIONS_COPY.METRIC_MEMBERS]: loc.memberCount,
    [LOCATIONS_COPY.METRIC_ACTIVE]: loc.activeThisWeek,
    [LOCATIONS_COPY.METRIC_MRR]: loc.mrr,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title={LOCATIONS_COPY.COMPARISON_TITLE}
        description={LOCATIONS_COPY.COMPARISON_DESCRIPTION}
      />

      <div className="rounded-lg border border-zinc-200 bg-kmvmt-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-kmvmt-navy">
          {LOCATIONS_COPY.METRIC_MEMBERS} & {LOCATIONS_COPY.METRIC_ACTIVE}
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey={LOCATIONS_COPY.METRIC_MEMBERS} fill="#192640" />
            <Bar dataKey={LOCATIONS_COPY.METRIC_ACTIVE} fill="#4A90D9" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-kmvmt-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-kmvmt-navy">{LOCATIONS_COPY.METRIC_MRR}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey={LOCATIONS_COPY.METRIC_MRR} fill="#192640" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
