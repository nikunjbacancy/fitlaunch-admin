import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/errors'
import { pmDashboardService } from './pmDashboardService'

const PENDING_KEY = ['pending-registrations'] as const

export function usePmMetrics() {
  return useQuery({
    queryKey: ['pm-dashboard-metrics'],
    queryFn: () => pmDashboardService.getMetrics(),
    staleTime: 60_000,
  })
}

export function useEngagement() {
  return useQuery({
    queryKey: ['pm-engagement'],
    queryFn: () => pmDashboardService.getEngagement(),
    staleTime: 60_000,
  })
}

export function usePendingRegistrations() {
  return useQuery({
    queryKey: PENDING_KEY,
    queryFn: () => pmDashboardService.getPendingRegistrations(),
    staleTime: 30_000,
  })
}

export function useApproveAllPending() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => pmDashboardService.approveAllPending(),
    onSuccess: () => {
      toast.success('All pending registrations approved')
      void queryClient.invalidateQueries({ queryKey: PENDING_KEY })
      void queryClient.invalidateQueries({ queryKey: ['pm-dashboard-metrics'] })
      void queryClient.invalidateQueries({ queryKey: ['residents'] })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })
}
