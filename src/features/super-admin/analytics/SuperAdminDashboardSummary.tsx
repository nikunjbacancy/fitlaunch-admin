import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PlatformMetrics } from './PlatformMetrics'
import { DashboardCharts } from './DashboardCharts'
import { DashboardOnboardingPreview } from './DashboardOnboardingPreview'
import { DashboardSupportPreview } from './DashboardSupportPreview'
import { DashboardSignupTrend } from './DashboardSignupTrend'
import { DASHBOARD_COPY } from './dashboard.constants'

export function SuperAdminDashboardSummary() {
  return (
    <div className="space-y-10">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-kmvmt-navy">
            {DASHBOARD_COPY.PAGE_TITLE}
          </h1>
          <p className="mt-0.5 text-xs text-kmvmt-navy/40">{DASHBOARD_COPY.PAGE_DESCRIPTION}</p>
        </div>
        <Link
          to="/super-admin/analytics"
          aria-label={DASHBOARD_COPY.ARIA_FULL_ANALYTICS}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-kmvmt-white px-3 py-2 text-sm font-medium text-kmvmt-navy transition-colors hover:bg-kmvmt-bg"
        >
          {DASHBOARD_COPY.BTN_FULL_ANALYTICS}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* KPI cards — 4 across */}
      <PlatformMetrics />

      {/* Charts row — tenant growth (2/3) + monthly signups (1/3) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardCharts />
        </div>
        <DashboardSignupTrend />
      </div>

      {/* Bottom row — pending onboarding + open tickets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardOnboardingPreview />
        <DashboardSupportPreview />
      </div>
    </div>
  )
}
