export type InvoiceStatus = 'paid' | 'open' | 'void' | 'uncollectible'
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
export type SubscriptionPlan = 'starter' | 'growth' | 'pro' | 'per_unit'

export interface Invoice {
  id: string
  tenantId: string
  tenantName: string
  amount: number
  status: InvoiceStatus
  invoiceNumber: string
  billingPeriodStart: string
  billingPeriodEnd: string
  paidAt: string | null
  createdAt: string
  invoiceUrl: string | null
}

export interface Subscription {
  id: string
  tenantId: string
  tenantName: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  mrr: number
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  trialEndsAt: string | null
}

export interface BillingOverviewMetrics {
  totalMrr: number
  mrrGrowth: number
  activeSubscriptions: number
  pastDueCount: number
  churnRate: number
  lifetimeValue: number
}
