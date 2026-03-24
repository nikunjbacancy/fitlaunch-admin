import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type { PlatformPricing, PricingTierFormValues } from './pricingTier.types'

export const pricingTierService = {
  async getAll(): Promise<PlatformPricing> {
    const response = await apiClient.get<PlatformPricing>(API_ENDPOINTS.PRICING.GET)
    return response.data
  },

  async update(payload: PricingTierFormValues): Promise<PlatformPricing> {
    const response = await apiClient.put<PlatformPricing>(API_ENDPOINTS.PRICING.UPDATE, payload)
    return response.data
  },
}
