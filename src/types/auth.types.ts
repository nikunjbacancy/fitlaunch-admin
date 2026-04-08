export type UserRole = 'super_admin' | 'property_owner' | 'property_manager' | 'trainer'
export type TenantType = 'apartment' | 'trainer'

// Internal camelCase shape used throughout the app
export interface AuthUser {
  id: string
  email: string
  fullName: string
  role: UserRole
  tenantId: string | null
  tenantName: string | null
  tenantType: TenantType | null
  ownerGroupId: string | null
  isTwoFactorVerified: boolean
}

// ── Raw API shapes (snake_case) ──────────────────────────────────────────────
// These match exactly what POST /auth/admin/login returns.
// Never use these outside authService.ts — map them to AuthUser immediately.

export interface ApiUser {
  id: string
  email: string
  full_name: string
  role: UserRole
  tenant_id: string | null
  owner_group_id: string | null
}

export interface ApiLoginData {
  access_token: string
  refresh_token: string
  expires_in: number
  user: ApiUser
}

export interface ApiLoginResponse {
  success: boolean
  data: ApiLoginData
}

export interface ApiRefreshData {
  access_token: string
}

export interface ApiRefreshResponse {
  success: boolean
  data: ApiRefreshData
}

// ── Internal types ───────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string
  password: string
}

export interface TwoFactorPayload {
  otp: string
}

// Normalised response returned by authService.login() to the rest of the app
export interface LoginResponse {
  user: AuthUser
  accessToken: string
}
