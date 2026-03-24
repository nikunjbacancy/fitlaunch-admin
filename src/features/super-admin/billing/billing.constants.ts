import type { InvoiceStatus, SubscriptionStatus, SubscriptionPlan } from './billing.types'

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  paid: 'Paid',
  open: 'Open',
  void: 'Void',
  uncollectible: 'Uncollectible',
}

export const INVOICE_STATUS_CLASSES: Record<InvoiceStatus, string> = {
  paid: 'bg-green-100 text-green-700 border-green-200',
  open: 'bg-blue-100 text-blue-700 border-blue-200',
  void: 'bg-slate-100 text-slate-600 border-slate-200',
  uncollectible: 'bg-red-100 text-red-700 border-red-200',
}

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: 'Active',
  trialing: 'Trial',
  past_due: 'Past Due',
  canceled: 'Canceled',
  unpaid: 'Unpaid',
}

export const SUBSCRIPTION_STATUS_CLASSES: Record<SubscriptionStatus, string> = {
  active: 'bg-green-100 text-green-700 border-green-200',
  trialing: 'bg-blue-100 text-blue-700 border-blue-200',
  past_due: 'bg-amber-100 text-amber-700 border-amber-200',
  canceled: 'bg-slate-100 text-slate-600 border-slate-200',
  unpaid: 'bg-red-100 text-red-700 border-red-200',
}

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  starter: 'Starter',
  growth: 'Growth',
  pro: 'Pro',
  per_unit: 'Per Unit',
}

export const INVOICES_PAGE_SIZE = 20
export const SUBSCRIPTIONS_PAGE_SIZE = 20

export const BILLING_COPY = {
  // Overview
  ERROR_METRICS: 'Failed to load billing metrics',
  ERROR_METRICS_DESC: 'Could not fetch billing data.',
  STAT_MRR: 'Total MRR',
  STAT_SUBSCRIPTIONS: 'Active Subscriptions',
  STAT_CHURN: 'Churn Rate',
  STAT_PAST_DUE: 'Past Due',
  TREND_VS_LAST_MONTH: 'vs last month',
  DESC_CHURN: 'Last 30 days',
  DESC_PAST_DUE: 'Requires attention',
  // Invoices
  ERROR_INVOICES: 'Failed to load invoices',
  ERROR_INVOICES_DESC: 'Could not fetch invoice data.',
  EMPTY_INVOICES: 'No invoices',
  EMPTY_INVOICES_DESC: 'No invoices found.',
  COL_INVOICE: 'Invoice',
  COL_TENANT: 'Tenant',
  COL_AMOUNT: 'Amount',
  COL_STATUS: 'Status',
  COL_BILLING_PERIOD: 'Billing Period',
  COL_ACTIONS: 'Actions',
  ARIA_VIEW_INVOICE: 'View invoice',
  // Subscriptions
  ERROR_SUBSCRIPTIONS: 'Failed to load subscriptions',
  ERROR_SUBSCRIPTIONS_DESC: 'Could not fetch subscription data.',
  EMPTY_SUBSCRIPTIONS: 'No subscriptions',
  EMPTY_SUBSCRIPTIONS_DESC: 'No subscriptions found.',
  COL_PLAN: 'Plan',
  COL_MRR: 'MRR',
  COL_RENEWS: 'Renews',
  COL_TRIAL_ENDS: 'Trial Ends',
  TOOLTIP_CANCELS: 'Cancels at period end',
} as const
