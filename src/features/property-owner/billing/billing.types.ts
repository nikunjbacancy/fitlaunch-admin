export interface OwnerBillingOverview {
  totalMrr: number
  totalUnits: number
  nextInvoiceDate: string | null
  paymentMethodLast4: string | null
  perLocationBreakdown: OwnerLocationBilling[]
}

export interface OwnerLocationBilling {
  locationId: string
  locationName: string
  unitCount: number
  pricePerUnit: number
  monthlyTotal: number
}

export interface OwnerInvoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  pdfUrl: string | null
}
