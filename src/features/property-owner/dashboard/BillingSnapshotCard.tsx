import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, CreditCard, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { useOwnerBillingSnapshot } from './useOwnerDashboard'
import { OWNER_DASHBOARD_COPY } from './constants'

/**
 * Combined Billing snapshot (CO #9).
 * SA-style listing card showing next invoice, payment method, and payment-failure alert.
 */
export function BillingSnapshotCard() {
  const { data, isLoading, isError, refetch } = useOwnerBillingSnapshot()

  if (isError) {
    return (
      <ErrorState
        title="Failed to load billing snapshot"
        description="Could not retrieve billing summary."
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  return (
    <div className="flex flex-col rounded-xl bg-kmvmt-white shadow-[0px_10px_40px_rgba(25,38,64,0.04)]">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-kmvmt-navy/40">
            {OWNER_DASHBOARD_COPY.SECTION_BILLING}
          </p>
          {data && data.paymentFailedCount > 0 && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-kmvmt-red-dark/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-kmvmt-red-dark">
              <AlertCircle className="h-3 w-3" />
              {OWNER_DASHBOARD_COPY.BILLING_PAYMENT_FAILED(data.paymentFailedCount)}
            </span>
          )}
        </div>
        <Link
          to="/property-owner/billing"
          className="flex items-center gap-1 text-xs font-medium text-kmvmt-navy/40 transition-colors hover:text-kmvmt-navy"
        >
          {OWNER_DASHBOARD_COPY.BILLING_VIEW_ALL}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Detail rows */}
      <div className="flex-1 px-4 pb-4">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : (
          <div>
            {/* Next invoice */}
            <div className="flex items-center gap-4 rounded-xl px-2 py-4 transition-colors hover:bg-kmvmt-bg/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-kmvmt-bg text-kmvmt-navy">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-kmvmt-navy">
                  {data?.nextInvoiceDate
                    ? new Date(data.nextInvoiceDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : OWNER_DASHBOARD_COPY.BILLING_NO_INVOICE}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-tight text-kmvmt-navy/40">
                  {OWNER_DASHBOARD_COPY.BILLING_NEXT_INVOICE}
                </p>
              </div>
              {data?.nextInvoiceAmount !== null && data?.nextInvoiceAmount !== undefined && (
                <span className="shrink-0 text-sm font-black tabular-nums text-kmvmt-navy">
                  ${data.nextInvoiceAmount.toLocaleString()}
                </span>
              )}
            </div>

            {/* Payment method */}
            <div className="flex items-center gap-4 rounded-xl px-2 py-4 transition-colors hover:bg-kmvmt-bg/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-kmvmt-bg text-kmvmt-navy">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-kmvmt-navy">
                  {data?.paymentMethodLast4
                    ? `•••• ${data.paymentMethodLast4}`
                    : OWNER_DASHBOARD_COPY.BILLING_NO_PAYMENT_METHOD}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-tight text-kmvmt-navy/40">
                  {OWNER_DASHBOARD_COPY.BILLING_PAYMENT_METHOD}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
