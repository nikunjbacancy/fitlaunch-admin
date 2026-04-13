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
import { StatCard } from '@/components/shared/StatCard'
import { ErrorState } from '@/components/shared/ErrorState'
import { useOwnerBillingOverview, useOwnerInvoices } from './useBilling'
import { OWNER_BILLING_COPY } from './constants'

const INVOICE_STATUS_CLASSES: Record<string, string> = {
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  failed: 'bg-kmvmt-red-dark/10 text-kmvmt-red-dark border-kmvmt-red-dark/20',
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
    <div className="space-y-8">
      {/* KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={OWNER_BILLING_COPY.STAT_TOTAL_MRR}
          value={isLoading ? '—' : `$${(overview?.totalMrr ?? 0).toLocaleString()}`}
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
      <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
        <div className="px-8 py-7">
          <h4 className="text-xl font-extrabold tracking-tight text-kmvmt-navy">
            {OWNER_BILLING_COPY.TABLE_TITLE}
          </h4>
          <p className="mt-1 text-sm text-kmvmt-navy/50">Monthly billing per location</p>
        </div>

        {isLoading ? (
          <div className="px-8 pb-8">
            <div className="h-32 animate-pulse rounded-lg bg-kmvmt-bg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-kmvmt-bg/50 border-y border-zinc-50">
                  <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {OWNER_BILLING_COPY.COL_LOCATION}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {OWNER_BILLING_COPY.COL_UNITS}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {OWNER_BILLING_COPY.COL_PRICE}
                  </TableHead>
                  <TableHead className="px-8 text-right text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {OWNER_BILLING_COPY.COL_MONTHLY}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-zinc-50">
                {(overview?.perLocationBreakdown ?? []).map((loc) => (
                  <TableRow
                    key={loc.locationId}
                    className="border-0 transition-colors hover:bg-kmvmt-bg/40"
                  >
                    <TableCell className="px-8 py-5 font-semibold text-kmvmt-navy">
                      {loc.locationName}
                    </TableCell>
                    <TableCell className="py-5 text-kmvmt-navy">{loc.unitCount}</TableCell>
                    <TableCell className="py-5 text-kmvmt-navy">
                      ${loc.pricePerUnit.toFixed(2)}
                    </TableCell>
                    <TableCell className="px-8 py-5 text-right font-semibold text-kmvmt-navy">
                      ${loc.monthlyTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                {overview && (
                  <TableRow className="border-0 bg-kmvmt-bg/40">
                    <TableCell className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-kmvmt-navy">
                      Total
                    </TableCell>
                    <TableCell className="py-5 font-bold text-kmvmt-navy">
                      {overview.totalUnits}
                    </TableCell>
                    <TableCell className="py-5 text-kmvmt-navy/40">—</TableCell>
                    <TableCell className="px-8 py-5 text-right font-black text-kmvmt-navy">
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
      <div className="overflow-hidden rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
        <div className="px-8 py-7">
          <h4 className="text-xl font-extrabold tracking-tight text-kmvmt-navy">
            {OWNER_BILLING_COPY.INVOICES_TITLE}
          </h4>
          <p className="mt-1 text-sm text-kmvmt-navy/50">
            Latest invoice history across your locations
          </p>
        </div>

        {loadingInvoices ? (
          <div className="px-8 pb-8">
            <div className="h-32 animate-pulse rounded-lg bg-kmvmt-bg" />
          </div>
        ) : (invoices ?? []).length === 0 ? (
          <div className="px-8 pb-10">
            <p className="text-center text-sm text-kmvmt-navy/40">No invoices yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-kmvmt-bg/50 border-y border-zinc-50">
                  <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {OWNER_BILLING_COPY.COL_DATE}
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {OWNER_BILLING_COPY.COL_AMOUNT}
                  </TableHead>
                  <TableHead className="px-8 text-right text-[10px] font-black uppercase tracking-widest text-kmvmt-navy">
                    {OWNER_BILLING_COPY.COL_STATUS}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-zinc-50">
                {(invoices ?? []).map((inv) => (
                  <TableRow
                    key={inv.id}
                    className="border-0 transition-colors hover:bg-kmvmt-bg/40"
                  >
                    <TableCell className="px-8 py-5 text-kmvmt-navy">
                      {new Date(inv.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-5 font-semibold text-kmvmt-navy">
                      ${inv.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="px-8 py-5 text-right">
                      <Badge
                        variant="outline"
                        className={`rounded-full text-[10px] font-bold uppercase tracking-wider ${INVOICE_STATUS_CLASSES[inv.status] ?? INVOICE_STATUS_CLASSES.pending}`}
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
