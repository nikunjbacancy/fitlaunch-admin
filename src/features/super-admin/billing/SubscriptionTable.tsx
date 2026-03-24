import { useState } from 'react'
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'
import { useSubscriptions } from './useBilling'
import {
  SUBSCRIPTION_STATUS_LABELS,
  SUBSCRIPTION_STATUS_CLASSES,
  PLAN_LABELS,
  BILLING_COPY,
} from './billing.constants'

const COLUMNS = 6

export function SubscriptionTable() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useSubscriptions(page)

  if (isError) {
    return (
      <ErrorState
        title={BILLING_COPY.ERROR_SUBSCRIPTIONS}
        description={BILLING_COPY.ERROR_SUBSCRIPTIONS_DESC}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const subscriptions = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1

  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{BILLING_COPY.COL_TENANT}</TableHead>
              <TableHead>{BILLING_COPY.COL_PLAN}</TableHead>
              <TableHead>{BILLING_COPY.COL_STATUS}</TableHead>
              <TableHead className="text-right tabular-nums">{BILLING_COPY.COL_MRR}</TableHead>
              <TableHead>{BILLING_COPY.COL_RENEWS}</TableHead>
              <TableHead>{BILLING_COPY.COL_TRIAL_ENDS}</TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <DataTableSkeleton columns={COLUMNS} />
          ) : subscriptions.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={COLUMNS}>
                  <EmptyState
                    title={BILLING_COPY.EMPTY_SUBSCRIPTIONS}
                    description={BILLING_COPY.EMPTY_SUBSCRIPTIONS_DESC}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium">{sub.tenantName}</span>
                      {sub.cancelAtPeriodEnd && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                          </TooltipTrigger>
                          <TooltipContent>{BILLING_COPY.TOOLTIP_CANCELS}</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {PLAN_LABELS[sub.plan]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs ${SUBSCRIPTION_STATUS_CLASSES[sub.status]}`}
                    >
                      {SUBSCRIPTION_STATUS_LABELS[sub.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${sub.mrr.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {sub.trialEndsAt ? new Date(sub.trialEndsAt).toLocaleDateString() : '—'}
                  </TableCell>
                </TableRow>
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
  )
}
