import { z } from 'zod'

export type UnitStatus = 'vacant' | 'occupied'

export interface UnitSummary {
  allocated: number
  added: number
  remaining: number
}

export interface UnitResident {
  id: string
  fullName: string
  email: string
  joinedAt: string
}

export interface Unit {
  id: string
  code: string
  status: UnitStatus
  resident_count: number
  residents?: UnitResident[]
  created_at: string | null
  // Present on POST /tenants/:id/units response so the client can update
  // the auth store's tenantOnboardingStep without a separate fetch.
  // Omitted on GET responses.
  onboarding_step?: string
}

const ALPHANUMERIC_REGEX = /^[A-Za-z0-9]+$/

export const addUnitSchema = z.object({
  prefix: z
    .string()
    .min(1, 'Prefix is required')
    .max(20, 'Prefix is too long')
    .regex(ALPHANUMERIC_REGEX, 'Letters and numbers only'),
  unit_number: z
    .string()
    .min(1, 'Unit number is required')
    .max(20, 'Unit number is too long')
    .regex(ALPHANUMERIC_REGEX, 'Letters and numbers only'),
})

export const generateRangeSchema = z
  .object({
    prefix: z
      .string()
      .min(1, 'Prefix is required')
      .max(20, 'Prefix is too long')
      .regex(ALPHANUMERIC_REGEX, 'Letters and numbers only'),
    from: z
      .number({ error: 'Must be a number' })
      .int('Must be a whole number')
      .min(1, 'Must be at least 1'),
    to: z
      .number({ error: 'Must be a number' })
      .int('Must be a whole number')
      .min(1, 'Must be at least 1'),
  })
  .refine((data) => data.to >= data.from, {
    message: '"To" must be greater than or equal to "From"',
    path: ['to'],
  })
  .refine((data) => data.to - data.from < 500, {
    message: 'Cannot generate more than 500 units at once',
    path: ['to'],
  })

export const editUnitSchema = z.object({
  code: z.string().min(1, 'Unit code is required').max(50, 'Unit code is too long'),
})

export interface TAddUnitPayload {
  code: string
}
export type TAddUnitFormValues = z.infer<typeof addUnitSchema>
export type TGenerateRangeFormValues = z.infer<typeof generateRangeSchema>
export type TEditUnitPayload = z.infer<typeof editUnitSchema>

export function buildUnitCode(prefix: string, unitNumber: string): string {
  return `${prefix.toUpperCase().trim()}-${unitNumber.trim()}`
}

export function buildRangeCodes(prefix: string, from: number, to: number): string[] {
  const codes: string[] = []
  const upperPrefix = prefix.toUpperCase().trim()
  for (let i = from; i <= to; i++) {
    codes.push(`${upperPrefix}-${String(i)}`)
  }
  return codes
}

export const MAX_RANGE_SIZE = 500
