import { useState } from 'react'
import { MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'
import { useSupportTickets } from './useSupportTickets'
import { SupportTicketRow } from './SupportTicketRow'
import { SupportTicketDetail } from './SupportTicketDetail'
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS, SUPPORT_COPY } from './support.constants'
import type { SupportTicket, TicketFilters, TicketStatus, TicketPriority } from './support.types'

const COLUMNS = 6

export function SupportQueue() {
  const [filters, setFilters] = useState<TicketFilters>({ status: 'open' })
  const [page, setPage] = useState(1)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)

  const { data, isLoading, isError, refetch } = useSupportTickets(filters, page)

  const tickets = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1

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
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder={SUPPORT_COPY.SEARCH_PLACEHOLDER}
            className="h-8 w-56 text-sm"
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
            <SelectTrigger className="h-8 w-36 text-sm">
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
            <SelectTrigger className="h-8 w-36 text-sm">
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

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{SUPPORT_COPY.COL_SUBJECT}</TableHead>
                <TableHead>{SUPPORT_COPY.COL_PRIORITY}</TableHead>
                <TableHead>{SUPPORT_COPY.COL_STATUS}</TableHead>
                <TableHead>{SUPPORT_COPY.COL_SUBMITTER}</TableHead>
                <TableHead>{SUPPORT_COPY.COL_DATE}</TableHead>
                <TableHead />
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
                      icon={<MessageSquare className="h-8 w-8 text-muted-foreground" />}
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
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || isLoading}
              onClick={() => {
                setPage((p) => p - 1)
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages || isLoading}
              onClick={() => {
                setPage((p) => p + 1)
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <SupportTicketDetail
        ticket={selectedTicket}
        onClose={() => {
          setSelectedTicket(null)
        }}
      />
    </>
  )
}
