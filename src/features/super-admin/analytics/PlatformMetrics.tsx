import { Building2, Users, DollarSign, UserPlus, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { usePlatformMetrics } from './useAnalytics'

export function PlatformMetrics() {
  const { data, isLoading } = usePlatformMetrics()

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard
        title="Total Tenants"
        value={isLoading ? '' : (data?.totalTenants ?? 0)}
        description={isLoading ? undefined : `${String(data?.activeTenants ?? 0)} active`}
        icon={<Building2 className="h-4 w-4" />}
        trend={data ? { value: data.tenantTrend, label: 'vs last month' } : undefined}
        isLoading={isLoading}
      />
      <StatCard
        title="Monthly Recurring Revenue"
        value={isLoading ? '' : `$${(data?.totalMrr ?? 0).toLocaleString()}`}
        icon={<DollarSign className="h-4 w-4" />}
        trend={data ? { value: data.mrrTrend, label: 'vs last month' } : undefined}
        isLoading={isLoading}
      />
      <StatCard
        title="Active Members"
        value={isLoading ? '' : (data?.activeMembers ?? 0).toLocaleString()}
        icon={<Users className="h-4 w-4" />}
        trend={data ? { value: data.memberTrend, label: 'vs last month' } : undefined}
        isLoading={isLoading}
      />
      <StatCard
        title="New Signups"
        value={isLoading ? '' : (data?.newSignupsThisMonth ?? 0)}
        description="This month"
        icon={<UserPlus className="h-4 w-4" />}
        trend={data ? { value: data.signupTrend, label: 'vs last month' } : undefined}
        isLoading={isLoading}
      />
      <StatCard
        title="Trial Conversion"
        value={isLoading ? '' : `${String(data?.trialConversionRate ?? 0)}%`}
        icon={<TrendingUp className="h-4 w-4" />}
        isLoading={isLoading}
      />
    </div>
  )
}
