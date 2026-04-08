import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/errors'
import { representativeService } from './representativeService'
import { REPRESENTATIVES_COPY } from './constants'
import type { TInviteRepresentativePayload } from './representative.types'

const REPS_KEY = ['owner-representatives'] as const

export function useRepresentatives() {
  return useQuery({
    queryKey: REPS_KEY,
    queryFn: () => representativeService.getAll(),
    staleTime: 60_000,
  })
}

export function useInviteRepresentative(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TInviteRepresentativePayload) => representativeService.invite(payload),
    onSuccess: () => {
      toast.success(REPRESENTATIVES_COPY.SUCCESS_INVITED)
      void queryClient.invalidateQueries({ queryKey: REPS_KEY })
      onSuccess?.()
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}

export function useRemoveRepresentative() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => representativeService.remove(id),
    onSuccess: () => {
      toast.success(REPRESENTATIVES_COPY.SUCCESS_REMOVED)
      void queryClient.invalidateQueries({ queryKey: REPS_KEY })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
