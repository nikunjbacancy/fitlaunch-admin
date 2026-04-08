import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'

export interface LocationBrandingPayload {
  app_display_name?: string
  primary_color?: string
  secondary_color?: string
  logo_url?: string
}

export const ownerBrandingService = {
  async updateBranding(locationId: string, payload: LocationBrandingPayload): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.OWNER_LOCATIONS.BRANDING(locationId), payload)
  },
}
