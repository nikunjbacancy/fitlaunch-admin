import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/errors'
import { pricingTierService } from './pricingTierService'
import type { PricingTierFormValues } from './pricingTier.types'

const QUERY_KEY = ['pricing-tiers'] as const

export function usePricingTiers() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => pricingTierService.getAll(),
    staleTime: 60_000,
  })
}

export function useUpdatePricingTiers() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: PricingTierFormValues) => pricingTierService.update(payload),
    onSuccess: () => {
      toast.success('Pricing updated successfully')
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
