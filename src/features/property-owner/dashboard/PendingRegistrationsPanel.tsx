import { Link } from 'react-router-dom'
import { ArrowRight, AlertCircle, CheckCheck } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useOwnerLocationStats } from './useOwnerDashboard'
import { OWNER_DASHBOARD_COPY } from './constants'

interface PendingByLocation {
  locationId: string
  locationName: string
  count: number
}

export function PendingRegistrationsPanel() {
  const { data: locations, isLoading } = useOwnerLocationStats()

  const byLocation: PendingByLocation[] = (locations ?? [])
    .filter((l) => l.pendingRegistrations > 0)
    .map((l) => ({
      locationId: l.locationId,
      locationName: l.locationName,
      count: l.pendingRegistrations,
    }))

  const totalPending = byLocation.reduce((sum, l) => sum + l.count, 0)

  return (
    <div className="flex flex-col rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-kmvmt-navy/40">
            {OWNER_DASHBOARD_COPY.SECTION_PENDING}
          </p>
          {totalPending > 0 && (
            <span className="mt-2 inline-flex items-center rounded-full bg-kmvmt-bg px-3 py-1 text-[10px] font-black uppercase tracking-wider text-kmvmt-navy/60">
              {totalPending} awaiting approval
            </span>
          )}
        </div>
        <Link
          to="/property-owner/locations"
          className="flex items-center gap-1 text-xs font-medium text-kmvmt-navy/40 transition-colors hover:text-kmvmt-navy"
        >
          {OWNER_DASHBOARD_COPY.PENDING_VIEW_ALL}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* List */}
      <div className="flex-1 px-4 pb-4">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : byLocation.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCheck className="h-5 w-5" />
            </div>
            <p className="text-xs text-kmvmt-navy/40">{OWNER_DASHBOARD_COPY.PENDING_EMPTY}</p>
          </div>
        ) : (
          <div>
            {byLocation.map((item) => (
              <Link
                key={item.locationId}
                to={`/property-owner/locations/${item.locationId}`}
                className="flex items-center gap-4 rounded-xl px-2 py-4 transition-colors hover:bg-kmvmt-bg/50"
              >
                {/* Icon tile */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-kmvmt-burgundy/10 text-kmvmt-burgundy">
                  <AlertCircle className="h-5 w-5" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-kmvmt-navy">{item.locationName}</p>
                  <p className="text-[10px] font-bold uppercase tracking-tight text-kmvmt-navy/40">
                    Awaiting review
                  </p>
                </div>

                {/* Count badge */}
                <span className="shrink-0 rounded-full bg-kmvmt-navy px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                  {item.count} pending
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
