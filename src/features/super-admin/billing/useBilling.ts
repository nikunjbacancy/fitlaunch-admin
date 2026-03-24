import { useQuery } from '@tanstack/react-query'
import { billingService } from './billingService'

export function useBillingMetrics() {
  return useQuery({
    queryKey: ['billing', 'metrics'],
    queryFn: () => billingService.getMetrics(),
    staleTime: 60_000,
  })
}

export function useInvoices(page = 1) {
  return useQuery({
    queryKey: ['billing', 'invoices', page],
    queryFn: () => billingService.getInvoices(page),
    staleTime: 30_000,
  })
}

export function useSubscriptions(page = 1) {
  return useQuery({
    queryKey: ['billing', 'subscriptions', page],
    queryFn: () => billingService.getSubscriptions(page),
    staleTime: 30_000,
  })
}
