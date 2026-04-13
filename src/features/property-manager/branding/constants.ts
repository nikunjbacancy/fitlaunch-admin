export const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024 // 2 MB
export const ACCEPTED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const

export const DEFAULT_PRIMARY_COLOR = '#192640'
export const DEFAULT_SECONDARY_COLOR = '#7ca3d1'

export const BRANDING_COPY = {
  PAGE_TITLE: 'Branding',
  PAGE_DESCRIPTION:
    'Customize how your community appears in the resident app — name, colors, and logo.',

  SECTION_IDENTITY: 'Brand Identity',
  SECTION_VISUAL: 'Visual Identity',
  SECTION_LOGO: 'Logo',

  APP_NAME_LABEL: 'Brand Name',
  APP_NAME_PLACEHOLDER: 'My Fitness Hub',

  PRIMARY_COLOR_LABEL: 'Primary Color',
  SECONDARY_COLOR_LABEL: 'Secondary Color',

  LOGO_LABEL: 'Logo',
  LOGO_HINT: 'PNG, JPG, or WebP. Max 2 MB. Must be square (1:1 ratio).',
  LOGO_DROP: 'Drag & drop or click to upload',
  LOGO_SQUARE_BADGE: 'Square (1:1)',
  LOGO_REPLACE: 'Replace logo',
  LOGO_SIZE_ERROR: 'Logo must be smaller than 2 MB.',
  LOGO_TYPE_ERROR: 'Only PNG, JPG, and WebP images are accepted.',
  LOGO_SQUARE_ERROR: 'Logo must be square (equal width and height).',

  PREVIEW_TITLE: 'Live Preview',
  PREVIEW_SUBTITLE: "How your app will look on your residents' phones.",

  SUBMIT: 'Save Branding',
  SAVING: 'Saving\u2026',
  SUCCESS: 'Branding saved successfully.',
} as const
