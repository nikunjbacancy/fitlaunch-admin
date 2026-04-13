import { Link } from 'react-router-dom'
import { Loader2, CheckCheck, ArrowRight, UserPlus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { usePendingRegistrations, useApproveAllPending } from './usePmDashboard'
import { DASHBOARD_COPY } from './constants'

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${String(mins)}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${String(hours)}h ago`
  const days = Math.floor(hours / 24)
  return `${String(days)}d ago`
}

export function PendingRegistrationsFeed() {
  const { data: registrations, isLoading, isError, refetch } = usePendingRegistrations()
  const { mutate: approveAll, isPending: isApproving } = useApproveAllPending()

  if (isError) {
    return (
      <ErrorState
        title={DASHBOARD_COPY.FEED_ERROR}
        description={DASHBOARD_COPY.FEED_EMPTY_DESC}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const items = registrations ?? []
  const count = items.length

  return (
    <div className="flex flex-col rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-kmvmt-navy/40">
            {DASHBOARD_COPY.FEED_TITLE}
          </p>
          {count > 0 && (
            <span className="mt-2 inline-flex items-center rounded-full bg-kmvmt-bg px-3 py-1 text-[10px] font-black uppercase tracking-wider text-kmvmt-navy/60">
              {count} awaiting approval
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {count > 0 && (
            <button
              type="button"
              disabled={isApproving}
              onClick={() => {
                approveAll()
              }}
              className="flex items-center gap-1 text-xs font-medium text-kmvmt-navy/60 transition-colors hover:text-kmvmt-navy disabled:opacity-50"
            >
              {isApproving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <CheckCheck className="h-3 w-3" />
              )}
              {DASHBOARD_COPY.FEED_APPROVE_ALL}
            </button>
          )}
          <Link
            to="/property-manager/residents"
            className="flex items-center gap-1 text-xs font-medium text-kmvmt-navy/40 transition-colors hover:text-kmvmt-navy"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 px-4 pb-4">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : count === 0 ? (
          <p className="py-8 text-center text-xs text-kmvmt-navy/40">{DASHBOARD_COPY.FEED_EMPTY}</p>
        ) : (
          <div>
            {items.map((reg) => (
              <div
                key={reg.id}
                className="flex items-center gap-4 rounded-xl px-2 py-4 transition-colors hover:bg-kmvmt-bg/50"
              >
                {/* Icon tile */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-kmvmt-bg text-kmvmt-navy">
                  <UserPlus className="h-5 w-5" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-kmvmt-navy">{reg.fullName}</p>
                  <p className="text-[10px] font-bold uppercase tracking-tight text-kmvmt-navy/40">
                    Unit {reg.unitNumber}
                  </p>
                </div>

                {/* Time */}
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-kmvmt-navy/40">
                  {formatTimeAgo(reg.submittedAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
