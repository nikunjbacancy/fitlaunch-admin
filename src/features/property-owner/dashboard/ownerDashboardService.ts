import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type { OwnerDashboardMetrics, OwnerLocationStats } from '@/types/tenant.types'

export const ownerDashboardService = {
  async getMetrics(): Promise<OwnerDashboardMetrics> {
    const response = await apiClient.get<{ success: boolean; data: OwnerDashboardMetrics }>(
      API_ENDPOINTS.OWNER_DASHBOARD.METRICS
    )
    return response.data.data
  },

  async getLocationStats(): Promise<OwnerLocationStats[]> {
    const response = await apiClient.get<{ success: boolean; data: OwnerLocationStats[] }>(
      API_ENDPOINTS.OWNER_DASHBOARD.LOCATION_STATS
    )
    return response.data.data
  },
}
