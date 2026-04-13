import { z } from 'zod'

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/

export const brandingSchema = z.object({
  app_display_name: z
    .string()
    .min(3, 'Display name must be at least 3 characters')
    .max(60, 'Display name is too long'),
  primary_color: z.string().regex(HEX_COLOR_REGEX, 'Must be a valid hex color (e.g. #FF5500)'),
  secondary_color: z.string().regex(HEX_COLOR_REGEX, 'Must be a valid hex color (e.g. #FF5500)'),
})

export type TBrandingFormValues = z.infer<typeof brandingSchema>

export interface TBrandingPayload extends TBrandingFormValues {
  logo?: File
}

// PATCH /tenants/:id/branding response. `onboarding_step` reflects backend
// auto-promotion to 'branding_complete' or 'active' once units also exist.
export interface TBrandingResponse {
  app_display_name: string
  primary_color: string
  secondary_color: string
  logo_url: string | null
  onboarding_step: string
}
