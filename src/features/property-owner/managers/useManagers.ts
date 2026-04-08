import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/errors'
import { managerService } from './managerService'
import { MANAGERS_COPY } from './constants'
import type { TAddManagerPayload } from './manager.types'

const MANAGERS_KEY = ['owner-managers'] as const

export function useManagers() {
  return useQuery({
    queryKey: MANAGERS_KEY,
    queryFn: () => managerService.getAll(),
    staleTime: 60_000,
  })
}

export function useAddManager(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TAddManagerPayload) => managerService.addToLocation(payload),
    onSuccess: () => {
      toast.success(MANAGERS_COPY.SUCCESS_ADDED)
      void queryClient.invalidateQueries({ queryKey: MANAGERS_KEY })
      void queryClient.invalidateQueries({ queryKey: ['owner-locations'] })
      onSuccess?.()
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}

export function useRemoveManager() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ locationId, managerId }: { locationId: string; managerId: string }) =>
      managerService.removeFromLocation(locationId, managerId),
    onSuccess: () => {
      toast.success(MANAGERS_COPY.SUCCESS_REMOVED)
      void queryClient.invalidateQueries({ queryKey: MANAGERS_KEY })
      void queryClient.invalidateQueries({ queryKey: ['owner-locations'] })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
