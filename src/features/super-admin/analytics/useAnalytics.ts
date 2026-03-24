import { useQuery } from '@tanstack/react-query'
import { analyticsService } from './analyticsService'

export function usePlatformMetrics() {
  return useQuery({
    queryKey: ['platform-metrics'],
    queryFn: () => analyticsService.getMetrics(),
    staleTime: 60_000,
  })
}

export function usePlatformAnalytics() {
  return useQuery({
    queryKey: ['platform-analytics'],
    queryFn: () => analyticsService.getAnalytics(),
    staleTime: 60_000,
  })
}
