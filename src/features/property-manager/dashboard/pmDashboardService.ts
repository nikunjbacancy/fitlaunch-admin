// TODO: Revert to real API calls when backend is connected.
// import { apiClient } from '@/lib/axios'
// import { API_ENDPOINTS } from '@/lib/endpoints'
import {
  MOCK_PM_METRICS,
  MOCK_PM_ENGAGEMENT,
  MOCK_PM_PENDING,
  MOCK_PM_COMMUNITY_ACTIVITY,
  MOCK_PM_ACTIVE_CHALLENGES,
} from './pmDashboard.mock'
import type {
  PmDashboardMetrics,
  EngagementDataPoint,
  PendingRegistration,
  CommunityActivityItem,
  ActiveChallengeSummary,
} from './pmDashboard.types'

export const pmDashboardService = {
  async getMetrics(): Promise<PmDashboardMetrics> {
    // TODO: Revert — return apiClient.get(API_ENDPOINTS.PM_DASHBOARD.METRICS).then(r => r.data)
    return Promise.resolve(MOCK_PM_METRICS)
  },

  async getEngagement(): Promise<EngagementDataPoint[]> {
    // TODO: Revert — return apiClient.get(API_ENDPOINTS.PM_DASHBOARD.ENGAGEMENT).then(r => r.data)
    return Promise.resolve(MOCK_PM_ENGAGEMENT)
  },

  async getPendingRegistrations(): Promise<PendingRegistration[]> {
    // TODO: Revert — return apiClient.get(API_ENDPOINTS.PM_DASHBOARD.PENDING_REGISTRATIONS).then(r => r.data)
    return Promise.resolve(MOCK_PM_PENDING)
  },

  async approveAllPending(): Promise<void> {
    // TODO: Revert — return apiClient.post(API_ENDPOINTS.PM_DASHBOARD.APPROVE_ALL_PENDING)
    return Promise.resolve()
  },

  async getCommunityActivity(): Promise<CommunityActivityItem[]> {
    // TODO: Revert — return apiClient.get(API_ENDPOINTS.PM_DASHBOARD.COMMUNITY_ACTIVITY).then(r => r.data)
    return Promise.resolve(MOCK_PM_COMMUNITY_ACTIVITY)
  },

  async getActiveChallenges(): Promise<ActiveChallengeSummary[]> {
    // TODO: Revert — return apiClient.get(API_ENDPOINTS.PM_DASHBOARD.ACTIVE_CHALLENGES).then(r => r.data)
    return Promise.resolve(MOCK_PM_ACTIVE_CHALLENGES)
  },
}
