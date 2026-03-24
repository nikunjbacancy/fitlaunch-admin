import React from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { PmDashboardSummary } from '@/features/property-manager/dashboard/PmDashboardSummary'
import { EngagementChart } from '@/features/property-manager/dashboard/EngagementChart'
import { PendingRegistrationsFeed } from '@/features/property-manager/dashboard/PendingRegistrationsFeed'

export default function DashboardPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your community's activity and registrations."
      />
      <PmDashboardSummary />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EngagementChart />
        </div>
        <div>
          <PendingRegistrationsFeed />
        </div>
      </div>
    </div>
  )
}
