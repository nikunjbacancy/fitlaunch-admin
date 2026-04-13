// TODO: Revert to real API calls when backend is connected.
// import { apiClient } from '@/lib/axios'
// import { API_ENDPOINTS } from '@/lib/endpoints'
import {
  MOCK_PLATFORM_METRICS,
  MOCK_PLATFORM_ANALYTICS,
  MOCK_ACTIVE_LAPSED_TREND,
  MOCK_SIGNUP_TREND,
  MOCK_CONVERSION_RATE_TREND,
  MOCK_LOG_VOLUME_TREND,
} from './dashboard.mock'
import type {
  PlatformMetrics,
  PlatformAnalytics,
  ActiveLapsedPoint,
  SignupTrendPoint,
  ConversionRatePoint,
  LogVolumePoint,
} from './analytics.types'

export const analyticsService = {
  async getMetrics(): Promise<PlatformMetrics> {
    // TODO: Revert — return apiClient.get(API_ENDPOINTS.ANALYTICS.METRICS).then(r => r.data.data)
    return Promise.resolve(MOCK_PLATFORM_METRICS)
  },

  async getAnalytics(): Promise<PlatformAnalytics> {
    // TODO: Revert — return apiClient.get(API_ENDPOINTS.ANALYTICS.OVERVIEW).then(r => r.data.data)
    return Promise.resolve(MOCK_PLATFORM_ANALYTICS)
  },

  async getActiveLapsedTrend(): Promise<ActiveLapsedPoint[]> {
    // TODO: Revert — return apiClient.get(API_ENDPOINTS.ANALYTICS.ACTIVE_LAPSED).then(r => r.data.data)
    return Promise.resolve(MOCK_ACTIVE_LAPSED_TREND)
  },

  async getSignupTrend(): Promise<SignupTrendPoint[]> {
    // TODO: Revert — return apiClient.get(API_ENDPOINTS.ANALYTICS.SIGNUP_TREND).then(r => r.data.data)
    return Promise.resolve(MOCK_SIGNUP_TREND)
  },

  async getConversionRateTrend(): Promise<ConversionRatePoint[]> {
    // TODO: Revert — return apiClient.get(API_ENDPOINTS.ANALYTICS.CONVERSION_TREND).then(r => r.data.data)
    return Promise.resolve(MOCK_CONVERSION_RATE_TREND)
  },

  async getLogVolumeTrend(): Promise<LogVolumePoint[]> {
    // TODO: Revert — return apiClient.get(API_ENDPOINTS.ANALYTICS.LOG_VOLUME).then(r => r.data.data)
    return Promise.resolve(MOCK_LOG_VOLUME_TREND)
  },
}
