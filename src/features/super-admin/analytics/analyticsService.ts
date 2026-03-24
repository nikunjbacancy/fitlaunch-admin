import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type { ApiResponse } from '@/types/api.types'
import type { PlatformMetrics, PlatformAnalytics } from './analytics.types'

export const analyticsService = {
  async getMetrics(): Promise<PlatformMetrics> {
    const response = await apiClient.get<ApiResponse<PlatformMetrics>>(
      API_ENDPOINTS.ANALYTICS.METRICS
    )
    return response.data.data
  },

  async getAnalytics(): Promise<PlatformAnalytics> {
    const response = await apiClient.get<ApiResponse<PlatformAnalytics>>(
      API_ENDPOINTS.ANALYTICS.PLATFORM
    )
    return response.data.data
  },
}
