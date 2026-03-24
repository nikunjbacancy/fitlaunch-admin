import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/errors'
import { featureFlagService } from './featureFlagService'

const QUERY_KEY = ['feature-flags'] as const

export function useFeatureFlags() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => featureFlagService.getAll(),
    staleTime: 60_000,
  })
}

export function useToggleFeatureFlag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isEnabled }: { id: string; isEnabled: boolean }) =>
      featureFlagService.toggle(id, isEnabled),

    // Optimistic update
    onMutate: async ({ id, isEnabled }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previous = queryClient.getQueryData(QUERY_KEY)
      queryClient.setQueryData(QUERY_KEY, (old: ReturnType<typeof useFeatureFlags>['data']) =>
        old?.map((flag) => (flag.id === id ? { ...flag, isEnabled } : flag))
      )
      return { previous }
    },

    onError: (err, _vars, ctx) => {
      queryClient.setQueryData(QUERY_KEY, ctx?.previous)
      toast.error(getErrorMessage(err))
    },

    onSuccess: (updated) => {
      toast.success(`"${updated.name}" ${updated.isEnabled ? 'enabled' : 'disabled'}`)
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
