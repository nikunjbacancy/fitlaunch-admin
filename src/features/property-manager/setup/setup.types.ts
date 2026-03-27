import { z } from 'zod'

export interface TBrandingPayload {
  app_display_name: string
  primary_color: string
  secondary_color: string
  logo?: File
}

export interface TUnit {
  id: string
  building: string
  block: string | null
  unit_number: string
  status: 'vacant' | 'occupied'
}

export interface TAddUnitPayload {
  building: string
  block?: string
  unit_number: string
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

export const addUnitSchema = z.object({
  building: z.string().min(1, 'Building is required'),
  block: z.string().optional(),
  unit_number: z.string().min(1, 'Unit number is required'),
})
