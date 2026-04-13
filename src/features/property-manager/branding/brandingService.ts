import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type { ApiResponse } from '@/types/api.types'
import type { TBrandingPayload, TBrandingResponse } from './branding.types'

export const brandingService = {
  async getBranding(tenantId: string): Promise<TBrandingResponse> {
    const response = await apiClient.get<ApiResponse<TBrandingResponse>>(
      API_ENDPOINTS.PM_SETUP.BRANDING(tenantId)
    )
    return response.data.data
  },

  async updateBranding(tenantId: string, payload: TBrandingPayload): Promise<TBrandingResponse> {
    const form = new FormData()
    form.append('app_display_name', payload.app_display_name)
    form.append('primary_color', payload.primary_color)
    form.append('secondary_color', payload.secondary_color)
    if (payload.logo) form.append('logo', payload.logo)

    const response = await apiClient.patch<ApiResponse<TBrandingResponse>>(
      API_ENDPOINTS.PM_SETUP.BRANDING(tenantId),
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data.data
  },
}
