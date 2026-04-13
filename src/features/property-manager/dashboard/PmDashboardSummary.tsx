import { Home, Users, Trophy, MessageSquare } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { ErrorState } from '@/components/shared/ErrorState'
import { usePmMetrics } from './usePmDashboard'
import { DASHBOARD_COPY } from './constants'

export function PmDashboardSummary() {
  const { data, isLoading, isError, refetch } = usePmMetrics()

  if (isError) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        description="Could not retrieve dashboard metrics."
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title={DASHBOARD_COPY.STAT_UNITS}
        value={isLoading ? '' : String(data?.totalUnits ?? 0)}
        description={
          data ? DASHBOARD_COPY.STAT_UNITS_DESC(data.occupiedUnits, data.vacantUnits) : undefined
        }
        icon={<Home className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <StatCard
        title={DASHBOARD_COPY.STAT_ACTIVE_MEMBERS}
        value={isLoading ? '' : String(data?.activeMembersThisWeek ?? 0)}
        description={DASHBOARD_COPY.STAT_ACTIVE_MEMBERS_DESC}
        trend={data ? { value: data.activeMembersTrend, label: 'vs last week' } : undefined}
        icon={<Users className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <StatCard
        title={DASHBOARD_COPY.STAT_CHALLENGES}
        value={isLoading ? '' : String(data?.challengesRunning ?? 0)}
        icon={<Trophy className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <StatCard
        title={DASHBOARD_COPY.STAT_POSTS}
        value={isLoading ? '' : String(data?.recentPostsCount ?? 0)}
        description={DASHBOARD_COPY.STAT_POSTS_DESC}
        icon={<MessageSquare className="h-4 w-4" />}
        isLoading={isLoading}
      />
    </div>
  )
}
