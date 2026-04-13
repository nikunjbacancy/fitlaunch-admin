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
    tenantType:
      apiUser.role === 'property_manager' || apiUser.role === 'property_owner'
        ? 'apartment'
        : apiUser.role === 'trainer'
          ? 'trainer'
          : null,
    ownerGroupId: apiUser.owner_group_id ?? null,
    isTwoFactorVerified: false,
  }
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await apiClient.post<ApiLoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload)
    const { data } = response.data
    const user = mapApiUser(data.user)
    // Login now returns tenant as a dedicated object. Prefer it as the
    // source of truth — `user.tenant_id` may be absent / stale in the new shape.
    if (data.tenant) {
      user.tenantId = data.tenant.id
      user.tenantName = data.tenant.name
      user.ownerGroupId = data.tenant.owner_group_id
    }
    return {
      user,
      accessToken: data.access_token,
      tenant: data.tenant,
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
