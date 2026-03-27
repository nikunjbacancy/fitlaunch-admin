import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/lib/endpoints'
import type {
  ApiRefreshResponse,
  LoginPayload,
  LoginResponse,
  ApiLoginResponse,
  AuthUser,
  TwoFactorPayload,
} from '@/types/auth.types'

// Map snake_case API user → camelCase AuthUser
function mapApiUser(apiUser: ApiLoginResponse['data']['user']): AuthUser {
  return {
    id: apiUser.id,
    email: apiUser.email,
    fullName: apiUser.full_name,
    role: apiUser.role,
    tenantId: apiUser.tenant_id,
    tenantName: null,
    // tenantType is not returned by the login endpoint — derive from role
    tenantType:
      apiUser.role === 'property_manager'
        ? 'apartment'
        : apiUser.role === 'trainer'
          ? 'trainer'
          : null,
    isTwoFactorVerified: false,
  }
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await apiClient.post<ApiLoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload)
    const { data } = response.data
    return {
      user: mapApiUser(data.user),
      accessToken: data.access_token,
    }
  },

  async verifyTwoFactor(payload: TwoFactorPayload): Promise<{ accessToken: string }> {
    const response = await apiClient.post<{ success: boolean; data: { access_token: string } }>(
      API_ENDPOINTS.AUTH.TWO_FACTOR_VERIFY,
      payload
    )
    return { accessToken: response.data.data.access_token }
  },

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
  },

  async refresh(): Promise<string> {
    const response = await apiClient.post<ApiRefreshResponse>(API_ENDPOINTS.AUTH.REFRESH)
    return response.data.data.access_token
  },
}
