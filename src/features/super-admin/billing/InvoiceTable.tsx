import { useState } from 'react'
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
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
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'
import { useInvoices } from './useBilling'
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_CLASSES, BILLING_COPY } from './billing.constants'

const COLUMNS = 6

export function InvoiceTable() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useInvoices(page)

  if (isError) {
    return (
      <ErrorState
        title={BILLING_COPY.ERROR_INVOICES}
        description={BILLING_COPY.ERROR_INVOICES_DESC}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  const invoices = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1

  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{BILLING_COPY.COL_INVOICE}</TableHead>
              <TableHead>{BILLING_COPY.COL_TENANT}</TableHead>
              <TableHead>{BILLING_COPY.COL_AMOUNT}</TableHead>
              <TableHead>{BILLING_COPY.COL_STATUS}</TableHead>
              <TableHead>{BILLING_COPY.COL_BILLING_PERIOD}</TableHead>
              <TableHead className="text-right">{BILLING_COPY.COL_ACTIONS}</TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <DataTableSkeleton columns={COLUMNS} />
          ) : invoices.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={COLUMNS}>
                  <EmptyState
                    title={BILLING_COPY.EMPTY_INVOICES}
                    description={BILLING_COPY.EMPTY_INVOICES_DESC}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell className="font-medium">{invoice.tenantName}</TableCell>
                  <TableCell className="tabular-nums">${invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs ${INVOICE_STATUS_CLASSES[invoice.status]}`}
                    >
                      {INVOICE_STATUS_LABELS[invoice.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(invoice.billingPeriodStart).toLocaleDateString()} –{' '}
                    {new Date(invoice.billingPeriodEnd).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.invoiceUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={invoice.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={BILLING_COPY.ARIA_VIEW_INVOICE}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
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
