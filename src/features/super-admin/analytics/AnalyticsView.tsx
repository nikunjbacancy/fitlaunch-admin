import { MrrChart } from './MrrChart'
import { TenantGrowthChart } from './TenantGrowthChart'
import { ActiveLapsedChart } from './ActiveLapsedChart'
import { SignupTrendChart } from './SignupTrendChart'
import { ConversionRateChart } from './ConversionRateChart'
import { LogVolumeChart } from './LogVolumeChart'
import { TopTenantsByMrrTable } from './TopTenantsByMrrTable'

export function AnalyticsView() {
  return (
    <div className="space-y-8">
      {/* Row 1 — MRR Trend + Tenant Growth */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <MrrChart />
        <TenantGrowthChart />
      </div>

      {/* Row 2 — Active vs Lapsed + New Signups */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ActiveLapsedChart />
        <SignupTrendChart />
      </div>

      {/* Row 3 — Conversion Rate + Log Volume */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ConversionRateChart />
        <LogVolumeChart />
      </div>

      {/* Row 4 — Top Tenants by MRR full width */}
      <TopTenantsByMrrTable />
    </div>
  )
}
