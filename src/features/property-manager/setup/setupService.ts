import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type { TBrandingPayload, TUnit, TAddUnitPayload, TBulkImportResult } from './setup.types'
import type { ApiResponse } from '@/types/api.types'

export const setupService = {
  async updateBranding(tenantId: string, payload: TBrandingPayload): Promise<void> {
    const form = new FormData()
    form.append('app_display_name', payload.app_display_name)
    form.append('primary_color', payload.primary_color)
    form.append('secondary_color', payload.secondary_color)
    if (payload.logo) form.append('logo', payload.logo)

    await apiClient.patch(API_ENDPOINTS.PM_SETUP.BRANDING(tenantId), form)
  },

  async addUnit(tenantId: string, payload: TAddUnitPayload): Promise<TUnit> {
    const response = await apiClient.post<ApiResponse<TUnit>>(
      API_ENDPOINTS.PM_SETUP.ADD_UNIT(tenantId),
      payload
    )
    return response.data.data
  },

  async bulkImportUnits(tenantId: string, file: File): Promise<TBulkImportResult> {
    const form = new FormData()
    form.append('file', file)
    const response = await apiClient.post<ApiResponse<TBulkImportResult>>(
      API_ENDPOINTS.PM_SETUP.BULK_UNITS(tenantId),
      form
    )
    return response.data.data
  },

  async completeOnboarding(tenantId: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.PM_SETUP.COMPLETE(tenantId))
  },
}
