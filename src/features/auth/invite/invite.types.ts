import { z } from 'zod'
import type { UserRole } from '@/types/auth.types'

export interface TInviteValidateResponse {
  full_name: string
  email: string
  complex_name: string | null
}

export interface TInviteAcceptPayload {
  token: string
  password: string
}

export interface TInviteAcceptResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  user: {
    id: string
    full_name: string
    email: string
    role: UserRole
    tenant_id: string | null
    owner_group_id: string | null
  }
  tenant: {
    id: string
    name: string | null
    onboarding_step: string
    owner_group_id: string | null
  } | null
}

export const acceptInviteSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
