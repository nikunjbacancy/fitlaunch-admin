import { z } from 'zod'

export interface TBrandingPayload {
  app_display_name: string
  primary_color: string
  secondary_color: string
  logo?: File
}

export type UnitStatus = 'vacant' | 'occupied'

export interface TUnit {
  id: string
  code: string
  status: UnitStatus
  resident_count: number
  created_at: string | null
}

export interface TAddUnitPayload {
  code: string
}

export interface TBulkImportResult {
  total: number
  imported: number
  skipped: number
  errors: { row: number; reason: string }[]
}

export const brandingSchema = z.object({
  app_display_name: z.string().min(3, 'Display name must be at least 3 characters'),
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g. #FF5500)'),
  secondary_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g. #FF5500)'),
})

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

export function buildUnitCode(prefix: string, unitNumber: string): string {
  return `${prefix.toUpperCase().trim()}-${unitNumber.trim()}`
}
