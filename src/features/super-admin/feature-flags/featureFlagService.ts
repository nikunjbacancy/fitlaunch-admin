import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type { FeatureFlag } from './featureFlag.types'

export const featureFlagService = {
  async getAll(): Promise<FeatureFlag[]> {
    const response = await apiClient.get<FeatureFlag[]>(API_ENDPOINTS.FEATURE_FLAGS.LIST)
    return response.data
  },

  async toggle(id: string, isEnabled: boolean): Promise<FeatureFlag> {
    const response = await apiClient.patch<FeatureFlag>(API_ENDPOINTS.FEATURE_FLAGS.TOGGLE(id), {
      isEnabled,
    })
    return response.data
  },
}
