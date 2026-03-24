import { PageHeader } from '@/components/shared/PageHeader'
import { PlatformMetrics } from './PlatformMetrics'
import { MrrChart } from './MrrChart'
import { TenantGrowthChart } from './TenantGrowthChart'
import { SignupFunnelChart } from './SignupFunnelChart'

export function AnalyticsView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Analytics"
        description="Trends, growth, and conversion metrics across all tenants"
      />

      <PlatformMetrics />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MrrChart />
        <TenantGrowthChart />
      </div>

      <SignupFunnelChart />
    </div>
  )
}
