import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useSupportTickets } from '../support/useSupportTickets'
import { DASHBOARD_COPY } from './dashboard.constants'
import type { TicketPriority } from '../support/support.types'

const PRIORITY_DOT_CLASSES: Record<TicketPriority, string> = {
  low: 'bg-zinc-400',
  medium: 'bg-amber-500',
  high: 'bg-kmvmt-burgundy',
  urgent: 'bg-kmvmt-red-dark',
}

const PRIORITY_TAG_CLASSES: Record<TicketPriority, string> = {
  low: 'bg-zinc-100 text-zinc-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-kmvmt-burgundy/10 text-kmvmt-burgundy',
  urgent: 'bg-kmvmt-red-dark/10 text-kmvmt-red-dark',
}

const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${String(mins)} min${mins !== 1 ? 's' : ''} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${String(hours)} hour${hours !== 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${String(days)} day${days !== 1 ? 's' : ''} ago`
}

export function DashboardSupportPreview() {
  const { data, isLoading } = useSupportTickets({ status: 'open' }, 1)
  const tickets = (data?.data ?? []).slice(0, 3)
  const criticalCount = tickets.filter(
    (t) => t.priority === 'urgent' || t.priority === 'high'
  ).length

  return (
    <div className="flex flex-col rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-kmvmt-navy/40">
            {DASHBOARD_COPY.SECTION_SUPPORT}
          </p>
          {criticalCount > 0 && (
            <span className="mt-2 inline-flex items-center rounded-full bg-kmvmt-burgundy/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-kmvmt-burgundy">
              Critical: {criticalCount}
            </span>
          )}
        </div>
        <Link
          to="/super-admin/support"
          className="flex items-center gap-1 text-xs font-medium text-kmvmt-navy/40 transition-colors hover:text-kmvmt-navy"
        >
          {DASHBOARD_COPY.BTN_VIEW_SUPPORT}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Tickets */}
      <div className="flex-1 px-4 pb-4">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <p className="py-8 text-center text-xs text-kmvmt-navy/40">
            {DASHBOARD_COPY.SUPPORT_EMPTY}
          </p>
        ) : (
          <div>
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-start gap-4 rounded-xl px-2 py-4 transition-colors hover:bg-kmvmt-bg/50"
              >
                {/* Priority dot */}
                <div className="mt-1.5 shrink-0">
                  <span
                    className={`block h-2.5 w-2.5 rounded-full ${PRIORITY_DOT_CLASSES[ticket.priority]}`}
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold text-kmvmt-navy">{ticket.subject}</p>
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-kmvmt-navy/40">
                      {formatTimeAgo(ticket.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-kmvmt-navy/50">
                    {ticket.description}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <span className="rounded px-2 py-0.5 text-[9px] font-bold uppercase bg-zinc-100 text-zinc-600">
                      {ticket.tenantName}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase ${PRIORITY_TAG_CLASSES[ticket.priority]}`}
                    >
                      {PRIORITY_LABELS[ticket.priority]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
