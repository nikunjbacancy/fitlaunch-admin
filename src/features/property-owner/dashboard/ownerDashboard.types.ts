export interface OwnerMrrTrendPoint {
  /** Short month label, e.g. "Nov" */
  month: string
  mrr: number
}

export interface OwnerBillingSnapshot {
  totalMrr: number
  nextInvoiceDate: string | null
  nextInvoiceAmount: number | null
  paymentMethodLast4: string | null
  /** Count of locations currently in payment_failed state */
  paymentFailedCount: number
}
