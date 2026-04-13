import { useState } from 'react'
import {
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Loader2,
  AlertOctagon,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageShell } from '@/components/shared/PageShell'
import { useSupportTickets } from './useSupportTickets'
import { SupportTicketRow } from './SupportTicketRow'
import { SupportTicketDetail } from './SupportTicketDetail'
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS, SUPPORT_COPY } from './support.constants'
import type { ReactNode } from 'react'
import type { SupportTicket, TicketFilters, TicketStatus, TicketPriority } from './support.types'

interface StatItem {
  icon: ReactNode
  label: string
  value: string | number
  trend?: string
  trendUp?: boolean
}

function StatsBar({ stats, isLoading }: { stats: StatItem[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-0 overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_4px_20px_rgba(25,38,64,0.06)]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-1 items-center gap-3 px-6 py-4">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-2.5 w-20 rounded" />
              <Skeleton className="h-5 w-14 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-stretch overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_4px_20px_rgba(25,38,64,0.06)]">
      {stats.map((stat, i) => (
        <div key={stat.label} className="relative flex flex-1 items-center gap-4 px-6 py-4">
          {i > 0 && (
            <div className="absolute left-0 top-1/2 h-8 w-px -translate-y-1/2 bg-zinc-100" />
          )}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-kmvmt-bg text-kmvmt-navy">
            <span className="[&>svg]:h-4 [&>svg]:w-4">{stat.icon}</span>
          </div>
          <div className="min-w-0">
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-kmvmt-navy/40">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-black tracking-tight text-kmvmt-navy tabular-nums">
                {stat.value}
              </p>
              {stat.trend && (
                <span
                  className={
                    stat.trendUp
                      ? 'text-[11px] font-bold text-emerald-600'
                      : 'text-[11px] font-bold text-kmvmt-red-light'
                  }
                >
                  {stat.trend}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const COLUMNS = 6

export function SupportQueue() {
  const [filters, setFilters] = useState<TicketFilters>({ status: 'open' })
  const [page, setPage] = useState(1)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)

  const { data, isLoading, isError, refetch } = useSupportTickets(filters, page)
  const { data: openData } = useSupportTickets({ status: 'open' }, 1)
  const { data: inProgressData } = useSupportTickets({ status: 'in_progress' }, 1)
  const { data: urgentData } = useSupportTickets({ priority: 'urgent' as TicketPriority }, 1)

  const tickets = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1

  const openCount = openData?.meta.total ?? 0
  const inProgressCount = inProgressData?.meta.total ?? 0
  const urgentCount = urgentData?.meta.total ?? 0

  const stats: StatItem[] = [
    {
      icon: <Inbox />,
      label: 'Open Tickets',
      value: openCount,
      trend: openCount > 0 ? 'Needs attention' : undefined,
      trendUp: false,
    },
    {
      icon: <Loader2 />,
      label: 'In Progress',
      value: inProgressCount,
      trend:
        openCount > 0
          ? `${String(Math.round((inProgressCount / Math.max(openCount, 1)) * 100))}% of open`
          : undefined,
      trendUp: true,
    },
    {
      icon: <AlertOctagon />,
      label: 'Urgent',
      value: urgentCount,
      trend: urgentCount > 0 ? 'Critical' : undefined,
      trendUp: false,
    },
  ]

  if (isError) {
    return (
      <ErrorState
        title={SUPPORT_COPY.ERROR_LOAD}
        description={SUPPORT_COPY.EMPTY_DESCRIPTION}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  return (
    <>
      <PageShell
        breadcrumb={['KMVMT', 'Support Queue']}
        title="Support Queue"
        statsBar={<StatsBar stats={stats} isLoading={isLoading} />}
        tableTitle="Active Tickets"
        tableActions
        filters={
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder={SUPPORT_COPY.SEARCH_PLACEHOLDER}
              className="h-9 w-56 border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy placeholder:text-kmvmt-navy/40 focus-visible:ring-kmvmt-navy"
              value={filters.search ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFilters((f) => ({ ...f, search: e.target.value }))
                setPage(1)
              }}
            />
            <Select
              value={filters.status ?? 'all'}
              onValueChange={(v) => {
                setFilters((f) => ({ ...f, status: v === 'all' ? undefined : (v as TicketStatus) }))
                setPage(1)
              }}
            >
              <SelectTrigger className="h-9 w-36 border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy">
                <SelectValue placeholder={SUPPORT_COPY.FILTER_ALL_STATUSES} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{SUPPORT_COPY.FILTER_ALL_STATUSES}</SelectItem>
                {Object.entries(TICKET_STATUS_LABELS).map(([v, label]) => (
                  <SelectItem key={v} value={v}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.priority ?? 'all'}
              onValueChange={(v) => {
                setFilters((f) => ({
                  ...f,
                  priority: v === 'all' ? undefined : (v as TicketPriority),
                }))
                setPage(1)
              }}
            >
              <SelectTrigger className="h-9 w-36 border-zinc-200 bg-kmvmt-white text-sm text-kmvmt-navy">
                <SelectValue placeholder={SUPPORT_COPY.FILTER_ALL_PRIORITIES} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{SUPPORT_COPY.FILTER_ALL_PRIORITIES}</SelectItem>
                {Object.entries(TICKET_PRIORITY_LABELS).map(([v, label]) => (
                  <SelectItem key={v} value={v}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        pagination={
          totalPages > 1 ? (
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest text-kmvmt-navy/50">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-200 text-kmvmt-navy hover:bg-kmvmt-bg"
                  disabled={page === 1 || isLoading}
                  onClick={() => {
                    setPage((p) => p - 1)
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-200 text-kmvmt-navy hover:bg-kmvmt-bg"
                  disabled={page === totalPages || isLoading}
                  onClick={() => {
                    setPage((p) => p + 1)
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : undefined
        }
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-kmvmt-bg/50 hover:bg-kmvmt-bg/50">
              <TableHead className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                {SUPPORT_COPY.COL_SUBJECT}
              </TableHead>
              <TableHead className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                {SUPPORT_COPY.COL_PRIORITY}
              </TableHead>
              <TableHead className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                {SUPPORT_COPY.COL_STATUS}
              </TableHead>
              <TableHead className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                {SUPPORT_COPY.COL_SUBMITTER}
              </TableHead>
              <TableHead className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                {SUPPORT_COPY.COL_DATE}
              </TableHead>
              <TableHead className="px-8 py-5" />
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <DataTableSkeleton columns={COLUMNS} />
          ) : tickets.length === 0 ? (
            <TableBody>
              <TableRow>
                <td colSpan={COLUMNS}>
                  <EmptyState
                    title={SUPPORT_COPY.EMPTY_TITLE}
                    description={SUPPORT_COPY.EMPTY_DESCRIPTION}
                    icon={<MessageSquare className="h-8 w-8 text-kmvmt-navy/30" />}
                  />
                </td>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {tickets.map((ticket) => (
                <SupportTicketRow key={ticket.id} ticket={ticket} onSelect={setSelectedTicket} />
              ))}
            </TableBody>
          )}
        </Table>
      </PageShell>

      <SupportTicketDetail
        ticket={selectedTicket}
        onClose={() => {
          setSelectedTicket(null)
        }}
      />
    </>
  )
}
