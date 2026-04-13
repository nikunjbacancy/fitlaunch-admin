// TODO: Revert to real API calls when backend is connected.
// import { apiClient } from '@/lib/axios'
// import { API_ENDPOINTS } from '@/lib/endpoints'
import { MOCK_ONBOARDING_QUEUE } from '../analytics/dashboard.mock'
import type { OnboardingApplication, ReviewPayload } from './onboarding.types'
import type { PaginatedResponse } from '@/types/api.types'

export const onboardingService = {
  async getAll(
    _status = 'pending',
    _page = 1,
    _limit = 20
  ): Promise<PaginatedResponse<OnboardingApplication>> {
    return Promise.resolve(MOCK_ONBOARDING_QUEUE)
  },

  async review(_id: string, payload: ReviewPayload): Promise<OnboardingApplication> {
    // Mock: return first item with updated status
    return Promise.resolve({ ...MOCK_ONBOARDING_QUEUE.data[0], ...payload })
  },
}
