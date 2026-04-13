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

export function useActiveLapsedTrend() {
  return useQuery({
    queryKey: ['analytics-active-lapsed'],
    queryFn: () => analyticsService.getActiveLapsedTrend(),
    staleTime: 60_000,
  })
}

export function useSignupTrend() {
  return useQuery({
    queryKey: ['analytics-signup-trend'],
    queryFn: () => analyticsService.getSignupTrend(),
    staleTime: 60_000,
  })
}

export function useConversionRateTrend() {
  return useQuery({
    queryKey: ['analytics-conversion-rate'],
    queryFn: () => analyticsService.getConversionRateTrend(),
    staleTime: 60_000,
  })
}

export function useLogVolumeTrend() {
  return useQuery({
    queryKey: ['analytics-log-volume'],
    queryFn: () => analyticsService.getLogVolumeTrend(),
    staleTime: 60_000,
  })
}
