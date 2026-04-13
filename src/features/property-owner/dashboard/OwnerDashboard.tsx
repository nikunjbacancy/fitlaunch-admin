import { useState } from 'react'
import { MapPin, Home, DollarSign, Users, Plus } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { ErrorState } from '@/components/shared/ErrorState'
import { usePermissions } from '@/hooks/use-permissions'
import { AddLocationModal } from '../locations/AddLocationModal'
import { useOwnerMetrics } from './useOwnerDashboard'
import { OwnerLocationStatsTable } from './OwnerLocationStatsTable'
import { PendingRegistrationsPanel } from './PendingRegistrationsPanel'
import { BillingSnapshotCard } from './BillingSnapshotCard'
import { MrrTrendChart } from './MrrTrendChart'
import { OWNER_DASHBOARD_COPY } from './constants'

export function OwnerDashboard() {
  const { can } = usePermissions()
  const { data, isLoading, isError, refetch } = useOwnerMetrics()
  const [addLocationOpen, setAddLocationOpen] = useState(false)

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
    <div className="space-y-10">
      {/* Page header — mirrors Super Admin dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-kmvmt-navy">
            {OWNER_DASHBOARD_COPY.PAGE_TITLE}
          </h1>
          <p className="mt-0.5 text-xs text-kmvmt-navy/40">
            {OWNER_DASHBOARD_COPY.PAGE_DESCRIPTION}
          </p>
        </div>
        {can('add_owner_location') && (
          <button
            type="button"
            onClick={() => {
              setAddLocationOpen(true)
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            {OWNER_DASHBOARD_COPY.ADD_LOCATION}
          </button>
        )}
      </div>

      {/* KPI cards — 4 across */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={OWNER_DASHBOARD_COPY.STAT_LOCATIONS}
          value={isLoading ? '' : String(data?.totalLocations ?? 0)}
          description={
            data ? OWNER_DASHBOARD_COPY.STAT_LOCATIONS_DESC(data.activeLocations) : undefined
          }
          icon={<MapPin className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <StatCard
          title={OWNER_DASHBOARD_COPY.STAT_UNITS}
          value={isLoading ? '' : String(data?.totalUnits ?? 0)}
          description={
            data ? OWNER_DASHBOARD_COPY.STAT_UNITS_DESC(data.overallOccupancyRate) : undefined
          }
          icon={<Home className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <StatCard
          title={OWNER_DASHBOARD_COPY.STAT_MRR}
          value={isLoading ? '' : `$${(data?.totalMrr ?? 0).toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4" />}
          trend={data ? { value: data.mrrTrend, label: 'vs last month' } : undefined}
          isLoading={isLoading}
        />
        <StatCard
          title={OWNER_DASHBOARD_COPY.STAT_MEMBERS}
          value={isLoading ? '' : String(data?.membersActiveThisWeek ?? 0)}
          description={OWNER_DASHBOARD_COPY.STAT_MEMBERS_DESC}
          icon={<Users className="h-4 w-4" />}
          trend={data ? { value: data.memberTrend, label: 'vs last week' } : undefined}
          isLoading={isLoading}
        />
      </div>

      {/* Charts row — MRR trend (2/3) + billing snapshot (1/3) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MrrTrendChart />
        </div>
        <BillingSnapshotCard />
      </div>

      {/* Bottom row — step-into-location + pending registrations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OwnerLocationStatsTable />
        <PendingRegistrationsPanel />
      </div>

      {/* Add Location modal */}
      <AddLocationModal open={addLocationOpen} onOpenChange={setAddLocationOpen} />
    </div>
  )
}
