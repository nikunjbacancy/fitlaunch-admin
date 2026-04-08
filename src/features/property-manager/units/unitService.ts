import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type { ApiResponse } from '@/types/api.types'
import type { Unit, UnitSummary, TAddUnitPayload, TEditUnitPayload } from './unit.types'
import type { TBulkImportResult } from '../setup/setup.types'

export const unitService = {
  async getSummary(tenantId: string): Promise<UnitSummary> {
    const response = await apiClient.get<ApiResponse<UnitSummary>>(
      API_ENDPOINTS.PM_SETUP.UNIT_SUMMARY(tenantId)
    )
    return response.data.data
  },

  async getAll(tenantId: string): Promise<Unit[]> {
    const response = await apiClient.get<ApiResponse<Unit[]>>(
      API_ENDPOINTS.PM_SETUP.ADD_UNIT(tenantId)
    )
    return response.data.data
  },

  async getById(tenantId: string, unitId: string): Promise<Unit> {
    const response = await apiClient.get<ApiResponse<Unit>>(
      API_ENDPOINTS.PM_SETUP.UNIT_DETAIL(tenantId, unitId)
    )
    return response.data.data
  },

  async add(tenantId: string, payload: TAddUnitPayload): Promise<Unit> {
    const response = await apiClient.post<ApiResponse<Unit>>(
      API_ENDPOINTS.PM_SETUP.ADD_UNIT(tenantId),
      payload
    )
    return response.data.data
  },

  async update(tenantId: string, unitId: string, payload: TEditUnitPayload): Promise<Unit> {
    const response = await apiClient.patch<ApiResponse<Unit>>(
      API_ENDPOINTS.PM_SETUP.UNIT_DETAIL(tenantId, unitId),
      payload
    )
    return response.data.data
  },

  async remove(tenantId: string, unitId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PM_SETUP.UNIT_DETAIL(tenantId, unitId))
  },

  async bulkImport(tenantId: string, file: File): Promise<TBulkImportResult> {
    const form = new FormData()
    form.append('file', file)
    const response = await apiClient.post<ApiResponse<TBulkImportResult>>(
      API_ENDPOINTS.PM_SETUP.BULK_UNITS(tenantId),
      form
    )
    return response.data.data
  },
}
