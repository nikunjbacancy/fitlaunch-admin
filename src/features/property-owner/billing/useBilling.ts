import { useQuery } from '@tanstack/react-query'
import { ownerBillingService } from './billingService'

export function useOwnerBillingOverview() {
  return useQuery({
    queryKey: ['owner-billing-overview'],
    queryFn: () => ownerBillingService.getOverview(),
    staleTime: 60_000,
  })
}

export function useOwnerInvoices() {
  return useQuery({
    queryKey: ['owner-invoices'],
    queryFn: () => ownerBillingService.getInvoices(),
    staleTime: 60_000,
  })
}
