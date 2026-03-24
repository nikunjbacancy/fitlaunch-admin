import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/errors'
import { promoCodeService } from './promoCodeService'
import type { CreatePromoCodeValues } from './promoCode.types'

const QUERY_KEY = ['promo-codes'] as const

export function usePromoCodes(page = 1) {
  return useQuery({
    queryKey: [...QUERY_KEY, page],
    queryFn: () => promoCodeService.getAll(page),
    staleTime: 30_000,
  })
}

export function useCreatePromoCode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePromoCodeValues) => promoCodeService.create(payload),
    onSuccess: () => {
      toast.success('Promo code created')
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}

export function useDeletePromoCode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => promoCodeService.delete(id),
    onSuccess: () => {
      toast.success('Promo code deleted')
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
