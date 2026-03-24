import { Users, Home, Clock, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { ErrorState } from '@/components/shared/ErrorState'
import { usePmMetrics } from './usePmDashboard'
import { DASHBOARD_COPY } from './constants'

export function PmDashboardSummary() {
  const { data, isLoading, isError, refetch } = usePmMetrics()

  if (isError) {
    return (
      <ErrorState
        title={DASHBOARD_COPY.FEED_ERROR}
        description={DASHBOARD_COPY.CHART_ERROR}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const occupancyRate = data
    ? Math.round((data.occupiedUnits / Math.max(data.totalUnits, 1)) * 100)
    : 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={DASHBOARD_COPY.STAT_RESIDENTS}
        value={isLoading ? '—' : String(data?.totalResidents ?? 0)}
        icon={<Users className="h-4 w-4" />}
        description={DASHBOARD_COPY.STAT_RESIDENTS_DESC(data?.activeResidents ?? 0)}
        isLoading={isLoading}
      />
      <StatCard
        title={DASHBOARD_COPY.STAT_OCCUPANCY}
        value={isLoading ? '—' : `${String(occupancyRate)}%`}
        icon={<Home className="h-4 w-4" />}
        description={DASHBOARD_COPY.STAT_OCCUPANCY_DESC(
          data?.occupiedUnits ?? 0,
          data?.totalUnits ?? 0
        )}
        isLoading={isLoading}
      />
      <StatCard
        title={DASHBOARD_COPY.STAT_PENDING}
        value={isLoading ? '—' : String(data?.pendingRegistrations ?? 0)}
        icon={<Clock className="h-4 w-4" />}
        description={DASHBOARD_COPY.FEED_EMPTY_DESC}
        isLoading={isLoading}
      />
      <StatCard
        title={DASHBOARD_COPY.STAT_ENGAGEMENT}
        value={isLoading ? '—' : `${String(data?.engagementRate ?? 0)}%`}
        icon={<TrendingUp className="h-4 w-4" />}
        description={DASHBOARD_COPY.STAT_ENGAGEMENT_DESC}
        isLoading={isLoading}
      />
    </div>
  )
}
