import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/errors'
import { onboardingService } from './onboardingService'
import type { ReviewPayload } from './onboarding.types'

const QUERY_KEY = ['onboarding'] as const

export function useOnboardingQueue(status = 'pending', page = 1) {
  return useQuery({
    queryKey: [...QUERY_KEY, status, page],
    queryFn: () => onboardingService.getAll(status, page),
    staleTime: 30_000,
  })
}

export function useReviewApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReviewPayload }) =>
      onboardingService.review(id, payload),
    onSuccess: (result) => {
      const action = result.status === 'approved' ? 'approved' : 'rejected'
      toast.success(`Application ${action} successfully`)
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
