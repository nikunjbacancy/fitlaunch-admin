import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type {
  TInviteValidateResponse,
  TInviteAcceptPayload,
  TInviteAcceptResponse,
} from './invite.types'
import type { ApiResponse } from '@/types/api.types'

export const inviteService = {
  async validateToken(token: string): Promise<TInviteValidateResponse> {
    const response = await apiClient.get<ApiResponse<TInviteValidateResponse>>(
      API_ENDPOINTS.INVITE.VALIDATE,
      { params: { token } }
    )
    return response.data.data
  },

  async acceptInvite(payload: TInviteAcceptPayload): Promise<TInviteAcceptResponse> {
    const response = await apiClient.post<ApiResponse<TInviteAcceptResponse>>(
      API_ENDPOINTS.INVITE.ACCEPT,
      payload
    )
    return response.data.data
  },
}
