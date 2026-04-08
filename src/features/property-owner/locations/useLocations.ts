import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/errors'
import { locationService } from './locationService'
import { LOCATIONS_COPY } from './constants'
import type { TCreateLocationPayload } from './location.types'

const LOCATIONS_KEY = ['owner-locations'] as const

export function useLocations() {
  return useQuery({
    queryKey: LOCATIONS_KEY,
    queryFn: () => locationService.getAll(),
    staleTime: 60_000,
  })
}

export function useLocationDetail(id: string) {
  return useQuery({
    queryKey: ['owner-location', id],
    queryFn: () => locationService.getById(id),
    staleTime: 60_000,
    enabled: Boolean(id),
  })
}

export function useCreateLocation(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TCreateLocationPayload) => locationService.create(payload),
    onSuccess: () => {
      toast.success(LOCATIONS_COPY.SUCCESS_CREATED)
      void queryClient.invalidateQueries({ queryKey: LOCATIONS_KEY })
      void queryClient.invalidateQueries({ queryKey: ['owner-dashboard-metrics'] })
      onSuccess?.()
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}

export function useLocationComparison() {
  return useQuery({
    queryKey: ['owner-location-comparison'],
    queryFn: () => locationService.getComparison(),
    staleTime: 60_000,
  })
}
