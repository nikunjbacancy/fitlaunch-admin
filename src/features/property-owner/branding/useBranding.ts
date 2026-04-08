import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/errors'
import { ownerBrandingService } from './brandingService'
import { OWNER_BRANDING_COPY } from './constants'
import type { LocationBrandingPayload } from './brandingService'

export function useUpdateLocationBranding(locationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: LocationBrandingPayload) =>
      ownerBrandingService.updateBranding(locationId, payload),
    onSuccess: () => {
      toast.success(OWNER_BRANDING_COPY.SUCCESS_SAVED)
      void queryClient.invalidateQueries({ queryKey: ['owner-location', locationId] })
      void queryClient.invalidateQueries({ queryKey: ['owner-locations'] })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
