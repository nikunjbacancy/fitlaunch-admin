import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type {
  PmDashboardMetrics,
  EngagementDataPoint,
  PendingRegistration,
} from './pmDashboard.types'

export const pmDashboardService = {
  async getMetrics(): Promise<PmDashboardMetrics> {
    const response = await apiClient.get<PmDashboardMetrics>(API_ENDPOINTS.PM_DASHBOARD.METRICS)
    return response.data
  },

  async getEngagement(): Promise<EngagementDataPoint[]> {
    const response = await apiClient.get<EngagementDataPoint[]>(
      API_ENDPOINTS.PM_DASHBOARD.ENGAGEMENT
    )
    return response.data
  },

  async getPendingRegistrations(): Promise<PendingRegistration[]> {
    const response = await apiClient.get<PendingRegistration[]>(
      API_ENDPOINTS.PM_DASHBOARD.PENDING_REGISTRATIONS
    )
    return response.data
  },

  async approveAllPending(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.PM_DASHBOARD.APPROVE_ALL_PENDING)
  },
}
