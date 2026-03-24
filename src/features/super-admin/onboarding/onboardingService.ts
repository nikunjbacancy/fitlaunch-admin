import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type { OnboardingApplication, ReviewPayload } from './onboarding.types'
import type { PaginatedResponse } from '@/types/api.types'

export const onboardingService = {
  async getAll(
    status = 'pending',
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<OnboardingApplication>> {
    const response = await apiClient.get<PaginatedResponse<OnboardingApplication>>(
      API_ENDPOINTS.ONBOARDING.LIST,
      { params: { status, page, limit } }
    )
    return response.data
  },

  async review(id: string, payload: ReviewPayload): Promise<OnboardingApplication> {
    const response = await apiClient.post<OnboardingApplication>(
      API_ENDPOINTS.ONBOARDING.REVIEW(id),
      payload
    )
    return response.data
  },
}
