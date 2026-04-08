import { DollarSign, Home, Calendar, CreditCard } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { ErrorState } from '@/components/shared/ErrorState'
import { DataTableSkeleton } from '@/components/shared/DataTableSkeleton'
import { useOwnerBillingOverview, useOwnerInvoices } from './useBilling'
import { OWNER_BILLING_COPY } from './constants'

const INVOICE_STATUS_CLASSES: Record<string, string> = {
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
}

export function OwnerBilling() {
  const { data: overview, isLoading, isError, refetch } = useOwnerBillingOverview()
  const { data: invoices, isLoading: loadingInvoices } = useOwnerInvoices()

  if (isError) {
    return (
      <ErrorState
        title={OWNER_BILLING_COPY.ERROR_LOAD}
        description={OWNER_BILLING_COPY.ERROR_LOAD_DESC}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={OWNER_BILLING_COPY.PAGE_TITLE}
        description={OWNER_BILLING_COPY.PAGE_DESCRIPTION}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={OWNER_BILLING_COPY.STAT_TOTAL_MRR}
          value={isLoading ? '—' : `$${String(overview?.totalMrr ?? 0)}`}
          icon={<DollarSign className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <StatCard
          title={OWNER_BILLING_COPY.STAT_TOTAL_UNITS}
          value={isLoading ? '—' : String(overview?.totalUnits ?? 0)}
          icon={<Home className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <StatCard
          title={OWNER_BILLING_COPY.STAT_NEXT_INVOICE}
          value={
            isLoading
              ? '—'
              : overview?.nextInvoiceDate
                ? new Date(overview.nextInvoiceDate).toLocaleDateString()
                : '—'
          }
          icon={<Calendar className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <StatCard
          title={OWNER_BILLING_COPY.STAT_PAYMENT_METHOD}
          value={
            isLoading
              ? '—'
              : overview?.paymentMethodLast4
                ? `•••• ${overview.paymentMethodLast4}`
                : '—'
          }
          icon={<CreditCard className="h-4 w-4" />}
          isLoading={isLoading}
        />
      </div>

      {/* Per-location breakdown */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-kmvmt-navy">{OWNER_BILLING_COPY.TABLE_TITLE}</h3>
        {isLoading ? (
          <DataTableSkeleton columns={4} rows={3} />
        ) : (
          <div className="rounded-lg border border-zinc-200 bg-kmvmt-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-kmvmt-navy">
                    {OWNER_BILLING_COPY.COL_LOCATION}
                  </TableHead>
                  <TableHead className="text-kmvmt-navy">{OWNER_BILLING_COPY.COL_UNITS}</TableHead>
                  <TableHead className="text-kmvmt-navy">{OWNER_BILLING_COPY.COL_PRICE}</TableHead>
                  <TableHead className="text-kmvmt-navy">
                    {OWNER_BILLING_COPY.COL_MONTHLY}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(overview?.perLocationBreakdown ?? []).map((loc) => (
                  <TableRow key={loc.locationId}>
                    <TableCell className="font-medium text-kmvmt-navy">
                      {loc.locationName}
                    </TableCell>
                    <TableCell className="text-kmvmt-navy">{loc.unitCount}</TableCell>
                    <TableCell className="text-kmvmt-navy">
                      ${loc.pricePerUnit.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-medium text-kmvmt-navy">
                      ${loc.monthlyTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                {overview && (
                  <TableRow className="bg-kmvmt-bg font-semibold">
                    <TableCell className="text-kmvmt-navy">Total</TableCell>
                    <TableCell className="text-kmvmt-navy">{overview.totalUnits}</TableCell>
                    <TableCell className="text-kmvmt-navy">—</TableCell>
                    <TableCell className="text-kmvmt-navy">
                      ${overview.totalMrr.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Recent invoices */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-kmvmt-navy">
          {OWNER_BILLING_COPY.INVOICES_TITLE}
        </h3>
        {loadingInvoices ? (
          <DataTableSkeleton columns={4} rows={3} />
        ) : (
          <div className="rounded-lg border border-zinc-200 bg-kmvmt-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-kmvmt-navy">{OWNER_BILLING_COPY.COL_DATE}</TableHead>
                  <TableHead className="text-kmvmt-navy">{OWNER_BILLING_COPY.COL_AMOUNT}</TableHead>
                  <TableHead className="text-kmvmt-navy">{OWNER_BILLING_COPY.COL_STATUS}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(invoices ?? []).map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="text-kmvmt-navy">
                      {new Date(inv.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium text-kmvmt-navy">
                      ${inv.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          INVOICE_STATUS_CLASSES[inv.status] ?? INVOICE_STATUS_CLASSES.pending
                        }
                      >
                        {inv.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
