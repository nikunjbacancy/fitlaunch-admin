import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Building2, LogIn, MapPin } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { useOwnerLocationStats } from './useOwnerDashboard'
import { OWNER_DASHBOARD_COPY } from './constants'
import { cn } from '@/lib/utils'
import type { OwnerLocationStats } from '@/types/tenant.types'

const STATUS_PILL: Record<OwnerLocationStats['status'], string> = {
  active: 'bg-emerald-50 text-emerald-700',
  suspended: 'bg-kmvmt-burgundy/10 text-kmvmt-burgundy',
  payment_failed: 'bg-kmvmt-red-dark/10 text-kmvmt-red-dark',
}

const STATUS_LABEL: Record<OwnerLocationStats['status'], string> = {
  active: OWNER_DASHBOARD_COPY.STATUS_ACTIVE,
  suspended: OWNER_DASHBOARD_COPY.STATUS_SUSPENDED,
  payment_failed: OWNER_DASHBOARD_COPY.STATUS_PAYMENT_FAILED,
}

/**
 * "Step Into Location" launcher (CO #6).
 * SA-style listing card showing the owner's locations with a click-to-step-in action.
 */
export function OwnerLocationStatsTable() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useOwnerLocationStats()

  if (isError) {
    return (
      <ErrorState
        title="Failed to load locations"
        description="Could not retrieve location performance data."
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const locations = data ?? []
  const count = locations.length

  return (
    <div className="flex flex-col rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-kmvmt-navy/40">
            {OWNER_DASHBOARD_COPY.SECTION_LOCATIONS}
          </p>
          {count > 0 && (
            <span className="mt-2 inline-flex items-center rounded-full bg-kmvmt-bg px-3 py-1 text-[10px] font-black uppercase tracking-wider text-kmvmt-navy/60">
              {count} {count === 1 ? 'location' : 'locations'}
            </span>
          )}
        </div>
        <Link
          to="/property-owner/locations"
          className="flex items-center gap-1 text-xs font-medium text-kmvmt-navy/40 transition-colors hover:text-kmvmt-navy"
        >
          {OWNER_DASHBOARD_COPY.LOCATIONS_VIEW_ALL}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* List */}
      <div className="flex-1 px-4 pb-4">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : count === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-kmvmt-bg text-kmvmt-navy/40">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="text-xs text-kmvmt-navy/40">{OWNER_DASHBOARD_COPY.LOCATIONS_EMPTY}</p>
          </div>
        ) : (
          <div>
            {locations.map((loc) => (
              <button
                key={loc.locationId}
                type="button"
                // TODO: When backend supports owner→PM impersonation, route to /property-manager/dashboard with location context.
                onClick={() => {
                  void navigate(`/property-owner/locations/${loc.locationId}`)
                }}
                className="group flex w-full items-center gap-4 rounded-xl px-2 py-4 text-left transition-colors hover:bg-kmvmt-bg/50"
              >
                {/* Icon tile */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-kmvmt-bg text-kmvmt-navy">
                  <Building2 className="h-5 w-5" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-kmvmt-navy">{loc.locationName}</p>
                  <p className="text-[10px] font-bold uppercase tracking-tight text-kmvmt-navy/40">
                    {loc.unitCount} units · {loc.occupancyRate}% occ · ${loc.mrr.toLocaleString()}{' '}
                    MRR
                  </p>
                </div>

                {/* Status pill */}
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
                    STATUS_PILL[loc.status]
                  )}
                >
                  {STATUS_LABEL[loc.status]}
                </span>

                {/* Step-in arrow (visible on hover) */}
                <span className="shrink-0 text-kmvmt-navy/30 transition-colors group-hover:text-kmvmt-navy">
                  <LogIn className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
