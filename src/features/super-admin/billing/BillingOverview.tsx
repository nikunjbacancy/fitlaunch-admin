import { DollarSign, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { ErrorState } from '@/components/shared/ErrorState'
import { useBillingMetrics } from './useBilling'
import { BILLING_COPY } from './billing.constants'

export function BillingOverview() {
  const { data, isLoading, isError, refetch } = useBillingMetrics()

  if (isError) {
    return (
      <ErrorState
        title={BILLING_COPY.ERROR_METRICS}
        description={BILLING_COPY.ERROR_METRICS_DESC}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={BILLING_COPY.STAT_MRR}
        value={isLoading ? '—' : `$${(data?.totalMrr ?? 0).toLocaleString()}`}
        icon={<DollarSign className="h-4 w-4" />}
        trend={
          data ? { value: data.mrrGrowth, label: BILLING_COPY.TREND_VS_LAST_MONTH } : undefined
        }
        isLoading={isLoading}
      />
      <StatCard
        title={BILLING_COPY.STAT_SUBSCRIPTIONS}
        value={isLoading ? '—' : String(data?.activeSubscriptions ?? 0)}
        icon={<CreditCard className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <StatCard
        title={BILLING_COPY.STAT_CHURN}
        value={isLoading ? '—' : `${String(data?.churnRate ?? 0)}%`}
        icon={<TrendingUp className="h-4 w-4" />}
        description={BILLING_COPY.DESC_CHURN}
        isLoading={isLoading}
      />
      <StatCard
        title={BILLING_COPY.STAT_PAST_DUE}
        value={isLoading ? '—' : String(data?.pastDueCount ?? 0)}
        icon={<AlertTriangle className="h-4 w-4" />}
        description={BILLING_COPY.DESC_PAST_DUE}
        isLoading={isLoading}
      />
    </div>
  )
}
