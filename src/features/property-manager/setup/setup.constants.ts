export const WIZARD_STEPS = [
  { id: 'branding', label: 'Brand Setup', step: 1 },
  { id: 'units', label: 'Unit Directory', step: 2 },
  { id: 'complete', label: 'Done', step: 3 },
] as const

export const ONBOARDING_STEP_TO_WIZARD_STEP: Record<string, number> = {
  invited: 1,
  password_set: 1,
  branding_complete: 2,
  billing_complete: 2,
  units_complete: 3,
  active: 3,
}

export const SETUP_COPY = {
  // Page
  PAGE_TITLE: 'Set up your workspace',
  PAGE_SUBTITLE: "Complete these steps to get your community's fitness portal up and running.",
  // Left panel step tracker
  STEP_1_LABEL: 'Brand Setup',
  STEP_1_DESC: 'Logo, colors and app name',
  STEP_2_LABEL: 'Unit Directory',
  STEP_2_DESC: 'Add units for resident registration',
  STEP_3_LABEL: 'Go Live',
  STEP_3_DESC: 'Your portal is ready to launch',
  LEFT_TAGLINE_1: "Let's make your app feel like home.",
  LEFT_TAGLINE_2: 'Almost there — add your residents\u2019 units.',
  LEFT_TAGLINE_3: 'Your community fitness portal is live.',
  // Mobile step indicator
  MOBILE_STEP_OF: 'Step {current} of {total}',
  // Branding step
  BRANDING_TITLE: 'Brand Setup',
  BRANDING_HEADING: 'Make it yours',
  BRANDING_SUBTITLE: 'Customize how your app looks for your residents.',
  BRANDING_APP_NAME_LABEL: 'Brand Name',
  BRANDING_APP_NAME_PLACEHOLDER: 'My Fitness Hub',
  BRANDING_PRIMARY_COLOR_LABEL: 'Primary Color',
  BRANDING_SECONDARY_COLOR_LABEL: 'Secondary Color',
  BRANDING_LOGO_LABEL: 'Logo',
  BRANDING_LOGO_HINT: 'PNG, JPG, or WebP. Max 2MB. Must be square (1:1 ratio).',
  BRANDING_LOGO_DROP: 'Drag & drop or click to upload',
  BRANDING_LOGO_SIZE_ERROR: 'Logo must be smaller than 2MB.',
  BRANDING_LOGO_SQUARE_ERROR: 'Logo must be square (equal width and height).',
  BRANDING_SQUARE_BADGE: 'Square (1:1)',
  BRANDING_SUBMIT: 'Save & Continue',
  BRANDING_SAVING: 'Saving…',
  BRANDING_SUCCESS: 'Branding saved successfully.',
  // Preview
  PREVIEW_TITLE: 'Live Preview',
  PREVIEW_SUBTITLE: "How your app will look on your residents' phones.",
  // Units step
  UNITS_TITLE: 'Unit Directory',
  UNITS_HEADING: 'Add your units',
  UNITS_SUBTITLE: 'Add your units so residents can register.',
  UNITS_TAB_CSV: 'Upload CSV',
  UNITS_TAB_MANUAL: 'Add Manually',
  UNITS_DOWNLOAD_TEMPLATE: 'Download template',
  UNITS_CSV_DROP: 'Drop your CSV here or click to browse',
  UNITS_CSV_HINT: 'Only .csv files are supported',
  UNITS_IMPORT_BUTTON: 'Import {n} Units',
  UNITS_IMPORTING: 'Importing\u2026',
  UNITS_BUILDING_LABEL: 'Building',
  UNITS_BUILDING_PLACEHOLDER: 'Building A',
  UNITS_BLOCK_LABEL: 'Block / Floor (optional)',
  UNITS_BLOCK_PLACEHOLDER: 'Floor 3',
  UNITS_NUMBER_LABEL: 'Unit Number',
  UNITS_NUMBER_PLACEHOLDER: '301',
  UNITS_ADD_BUTTON: 'Add Unit',
  UNITS_ADDING: 'Adding\u2026',
  UNITS_COUNT: '{n} units added',
  UNITS_SKIP: 'Skip for now',
  UNITS_CONTINUE: 'Continue',
  UNITS_SUCCESS: 'Units imported successfully.',
  // Completion step
  COMPLETE_TITLE: 'Workspace is ready!',
  COMPLETE_HEADING: "You're live.",
  COMPLETE_SUBTITLE: "You're all set. Your community's fitness portal is ready.",
  COMPLETE_SUBTITLE_NEW: "Your community's fitness portal is ready for residents.",
  COMPLETE_CARD_COMPLEX: 'Complex',
  COMPLETE_CARD_APP_NAME: 'App Name',
  COMPLETE_CARD_UNITS: 'Units Configured',
  COMPLETE_CARD_BILLING: 'Billing',
  COMPLETE_BILLING_PLACEHOLDER: 'Will be configured shortly',
  COMPLETE_CTA: 'Open Dashboard',
  COMPLETE_SUMMARY_COMPLEX: 'Complex',
  COMPLETE_SUMMARY_BRAND: 'Brand name',
  COMPLETE_SUMMARY_UNITS: 'Units configured',
  // CSV preview
  CSV_PREVIEW_MORE: 'and {n} more\u2026',
  CSV_COLUMN_BUILDING: 'Building',
  CSV_COLUMN_BLOCK: 'Block',
  CSV_COLUMN_UNIT: 'Unit',
  // Import result
  IMPORT_IMPORTED: 'Imported:',
  IMPORT_SKIPPED: 'Skipped:',
} as const

export const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024 // 2MB
export const ACCEPTED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp']
export const CSV_TEMPLATE_HEADER = 'building,block,unit_number'
export const CSV_TEMPLATE_EXAMPLE = 'Building A,Floor 1,101'
export const CSV_PREVIEW_ROWS = 5
