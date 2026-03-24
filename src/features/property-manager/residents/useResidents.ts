import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/errors'
import { residentService } from './residentService'
import type { ResidentFilters } from './resident.types'

const QUERY_KEY = ['residents'] as const

export function useResidents(filters: ResidentFilters, page = 1) {
  return useQuery({
    queryKey: [...QUERY_KEY, filters, page],
    queryFn: () => residentService.getAll(filters, page),
    staleTime: 30_000,
  })
}

export function useRemoveResident() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => residentService.remove(id),
    onSuccess: () => {
      toast.success('Resident removed')
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}

export function useBulkApproveResidents() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => residentService.bulkApprove(ids),
    onSuccess: (_data, ids) => {
      toast.success(`${String(ids.length)} resident${ids.length === 1 ? '' : 's'} approved`)
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
