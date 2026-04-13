import { Building2, Users, DollarSign, UserPlus } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { usePlatformMetrics } from './useAnalytics'

export function PlatformMetrics() {
  const { data, isLoading } = usePlatformMetrics()

  const tenantDescription = isLoading
    ? undefined
    : `${String(data?.activeTenants ?? 0)} active · ${String(data?.lapsedTenants ?? 0)} lapsed · ${String(data?.trialTenants ?? 0)} trial`

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Cumulative growth → smooth area */}
      <StatCard
        title="Total Tenants"
        value={isLoading ? '' : (data?.totalTenants ?? 0)}
        description={tenantDescription}
        icon={<Building2 className="h-4 w-4" />}
        trend={data ? { value: data.tenantTrend, label: 'vs last month' } : undefined}
        sparklineData={data?.tenantSparkline}
        chartType="area"
        isLoading={isLoading}
      />

      {/* Running revenue → area with gradient */}
      <StatCard
        title="Monthly Recurring Revenue"
        value={isLoading ? '' : `$${(data?.totalMrr ?? 0).toLocaleString()}`}
        icon={<DollarSign className="h-4 w-4" />}
        trend={data ? { value: data.mrrTrend, label: 'vs last month' } : undefined}
        sparklineData={data?.mrrSparkline}
        chartType="area"
        isLoading={isLoading}
      />

      {/* Discrete monthly count → standard bars */}
      <StatCard
        title="Active Members"
        value={isLoading ? '' : (data?.activeMembers ?? 0).toLocaleString()}
        icon={<Users className="h-4 w-4" />}
        trend={data ? { value: data.memberTrend, label: 'vs last month' } : undefined}
        sparklineData={data?.memberSparkline}
        chartType="bar"
        isLoading={isLoading}
      />

      {/* Event count — fluctuates → line with dots */}
      <StatCard
        title="New Signups"
        value={isLoading ? '' : (data?.newSignupsThisMonth ?? 0)}
        description="This month"
        icon={<UserPlus className="h-4 w-4" />}
        trend={data ? { value: data.signupTrend, label: 'vs last month' } : undefined}
        sparklineData={data?.signupSparkline}
        chartType="line"
        isLoading={isLoading}
      />
    </div>
  )
}
