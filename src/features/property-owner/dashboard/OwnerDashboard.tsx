import { MapPin, Home, Users, DollarSign, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { ErrorState } from '@/components/shared/ErrorState'
import { useOwnerMetrics } from './useOwnerDashboard'
import { OwnerLocationStatsTable } from './OwnerLocationStatsTable'
import { OWNER_DASHBOARD_COPY } from './constants'

export function OwnerDashboard() {
  const { data, isLoading, isError, refetch } = useOwnerMetrics()

  if (isError) {
    return (
      <ErrorState
        title={OWNER_DASHBOARD_COPY.ERROR_TITLE}
        description={OWNER_DASHBOARD_COPY.ERROR_DESCRIPTION}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={OWNER_DASHBOARD_COPY.PAGE_TITLE}
        description={OWNER_DASHBOARD_COPY.PAGE_DESCRIPTION}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title={OWNER_DASHBOARD_COPY.STAT_LOCATIONS}
          value={isLoading ? '—' : String(data?.totalLocations ?? 0)}
          icon={<MapPin className="h-4 w-4" />}
          description={OWNER_DASHBOARD_COPY.STAT_LOCATIONS_DESC(data?.activeLocations ?? 0)}
          isLoading={isLoading}
        />
        <StatCard
          title={OWNER_DASHBOARD_COPY.STAT_UNITS}
          value={isLoading ? '—' : String(data?.totalUnits ?? 0)}
          icon={<Home className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <StatCard
          title={OWNER_DASHBOARD_COPY.STAT_MEMBERS}
          value={isLoading ? '—' : String(data?.totalMembers ?? 0)}
          icon={<Users className="h-4 w-4" />}
          description={OWNER_DASHBOARD_COPY.STAT_MEMBERS_DESC(data?.membersActiveThisWeek ?? 0)}
          isLoading={isLoading}
        />
        <StatCard
          title={OWNER_DASHBOARD_COPY.STAT_MRR}
          value={isLoading ? '—' : `$${String(data?.totalMrr ?? 0)}`}
          icon={<DollarSign className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <StatCard
          title={OWNER_DASHBOARD_COPY.STAT_CHALLENGES}
          value={isLoading ? '—' : String(data?.challengesRunning ?? 0)}
          icon={<TrendingUp className="h-4 w-4" />}
          isLoading={isLoading}
        />
      </div>

      <OwnerLocationStatsTable />
    </div>
  )
}
