import { useQuery } from '@tanstack/react-query'
import { ownerDashboardService } from './ownerDashboardService'

export function useOwnerMetrics() {
  return useQuery({
    queryKey: ['owner-dashboard-metrics'],
    queryFn: () => ownerDashboardService.getMetrics(),
    staleTime: 60_000,
  })
}

export function useOwnerLocationStats() {
  return useQuery({
    queryKey: ['owner-location-stats'],
    queryFn: () => ownerDashboardService.getLocationStats(),
    staleTime: 60_000,
  })
}
