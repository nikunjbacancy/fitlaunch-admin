import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageShell } from '@/components/shared/PageShell'
import { Skeleton } from '@/components/ui/skeleton'
import { useBillingMetrics } from '@/features/super-admin/billing/useBilling'
import { InvoiceTable } from '@/features/super-admin/billing/InvoiceTable'
import { SubscriptionTable } from '@/features/super-admin/billing/SubscriptionTable'
import { PricingTierForm } from '@/features/super-admin/billing/pricing-tiers/PricingTierForm'
import { DollarSign, CreditCard, TrendingDown } from 'lucide-react'
import type { ReactNode } from 'react'

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

export default function BillingPage(): React.ReactElement {
  const { data, isLoading } = useBillingMetrics()

  const mrrGrowth = data?.mrrGrowth ?? 0
  const stats: StatItem[] = [
    {
      icon: <DollarSign />,
      label: 'Monthly Recurring Revenue',
      value: isLoading ? '—' : `$${(data?.totalMrr ?? 0).toLocaleString()}`,
      trend:
        data?.mrrGrowth != null
          ? `${mrrGrowth > 0 ? '+' : ''}${String(mrrGrowth)}% vs last month`
          : undefined,
      trendUp: mrrGrowth >= 0,
    },
    {
      icon: <CreditCard />,
      label: 'Active Subscriptions',
      value: isLoading ? '—' : (data?.activeSubscriptions ?? 0),
    },
    {
      icon: <TrendingDown />,
      label: 'Churn Rate',
      value: isLoading ? '—' : `${String(data?.churnRate ?? 0)}%`,
      trend:
        (data?.pastDueCount ?? 0) > 0 ? `${String(data?.pastDueCount ?? 0)} past due` : undefined,
      trendUp: false,
    },
  ]

  return (
    <PageShell
      breadcrumb={['KMVMT', 'Billing']}
      title="Billing"
      statsBar={<StatsBar stats={stats} isLoading={isLoading} />}
      tableTitle="Billing Details"
      tableActions
    >
      <div className="p-6">
        <Tabs defaultValue="subscriptions">
          <TabsList>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Tiers</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="mt-4">
            <SubscriptionTable />
          </TabsContent>
          <TabsContent value="invoices" className="mt-4">
            <InvoiceTable />
          </TabsContent>
          <TabsContent value="pricing" className="mt-4">
            <PricingTierForm />
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  )
}
