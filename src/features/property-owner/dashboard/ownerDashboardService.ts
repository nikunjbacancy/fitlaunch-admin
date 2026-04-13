// TODO: Revert to real API calls when backend is connected.
// import { apiClient } from '@/lib/axios'
// import { API_ENDPOINTS } from '@/lib/endpoints'
import {
  MOCK_OWNER_METRICS,
  MOCK_OWNER_LOCATION_STATS,
  MOCK_OWNER_MRR_TREND,
  MOCK_OWNER_BILLING_SNAPSHOT,
} from './ownerDashboard.mock'
import type { OwnerDashboardMetrics, OwnerLocationStats } from '@/types/tenant.types'
import type { OwnerMrrTrendPoint, OwnerBillingSnapshot } from './ownerDashboard.types'

export const ownerDashboardService = {
  async getMetrics(): Promise<OwnerDashboardMetrics> {
    // TODO: Revert — return apiClient.get(API_ENDPOINTS.OWNER_DASHBOARD.METRICS).then(r => r.data.data)
    return Promise.resolve(MOCK_OWNER_METRICS)
  },

  async getLocationStats(): Promise<OwnerLocationStats[]> {
    // TODO: Revert — return apiClient.get(API_ENDPOINTS.OWNER_DASHBOARD.LOCATION_STATS).then(r => r.data.data)
    return Promise.resolve(MOCK_OWNER_LOCATION_STATS)
  },

  async getMrrTrend(): Promise<OwnerMrrTrendPoint[]> {
    // TODO: Revert — return apiClient.get(API_ENDPOINTS.OWNER_DASHBOARD.MRR_TREND).then(r => r.data.data)
    return Promise.resolve(MOCK_OWNER_MRR_TREND)
  },

  async getBillingSnapshot(): Promise<OwnerBillingSnapshot> {
    // TODO: Revert — return apiClient.get(API_ENDPOINTS.OWNER_DASHBOARD.BILLING_SNAPSHOT).then(r => r.data.data)
    return Promise.resolve(MOCK_OWNER_BILLING_SNAPSHOT)
  },
}
