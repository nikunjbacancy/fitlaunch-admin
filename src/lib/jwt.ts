import type { AuthUser, UserRole } from '@/types/auth.types'
import type { TenantType } from '@/types/auth.types'

interface JwtPayload {
  sub?: string
  id?: string
  email?: string
  full_name?: string
  role?: UserRole
  tenant_id?: string | null
  exp?: number
  iat?: number
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const segments = token.split('.')
    if (segments.length !== 3) return null
    const base64 = segments[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64)) as JwtPayload
  } catch {
    return null
  }
}

export function jwtToAuthUser(token: string): AuthUser | null {
  const payload = decodeJwtPayload(token)
  if (!payload) return null

  const id = payload.sub ?? payload.id
  if (!id || !payload.email || !payload.role) return null

  const tenantType: TenantType | null =
    payload.role === 'property_manager'
      ? 'apartment'
      : payload.role === 'trainer'
        ? 'trainer'
        : null

  return {
    id,
    email: payload.email,
    fullName: payload.full_name ?? '',
    role: payload.role,
    tenantId: payload.tenant_id ?? null,
    tenantName: null,
    tenantType,
    isTwoFactorVerified: false,
  }
}
