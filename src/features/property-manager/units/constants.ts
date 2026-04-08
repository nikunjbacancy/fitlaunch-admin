export const UNITS_COPY = {
  PAGE_TITLE: 'Unit Directory',
  PAGE_DESCRIPTION: 'Manage units for resident registration',
  // Actions
  ADD_UNIT: 'Add Unit',
  GENERATE_RANGE: 'Generate Range',
  IMPORT_CSV: 'Import CSV',
  // Table
  COL_CODE: 'Unit Code',
  COL_STATUS: 'Status',
  COL_RESIDENTS: 'Residents',
  COL_CREATED: 'Added',
  COL_ACTIONS: 'Actions',
  // Add modal
  MODAL_TITLE: 'Add Unit',
  MODAL_DESCRIPTION: 'Add a new unit to the directory.',
  FIELD_PREFIX: 'Block / Building',
  FIELD_PREFIX_PLACEHOLDER: 'e.g. A, B, T1',
  FIELD_PREFIX_HINT: 'Letters and numbers only',
  FIELD_UNIT_NUMBER: 'Unit Number',
  FIELD_UNIT_NUMBER_PLACEHOLDER: 'e.g. 101, 9, 12A',
  FIELD_UNIT_NUMBER_HINT: 'Letters and numbers only',
  FIELD_PREVIEW_LABEL: 'Generated Code',
  BTN_ADD: 'Add Unit',
  BTN_CANCEL: 'Cancel',
  // Generate range
  GENERATE_TITLE: 'Generate Units',
  GENERATE_DESCRIPTION: 'Create a range of units for a building or block.',
  GENERATE_PREFIX: 'Block / Building',
  GENERATE_PREFIX_PLACEHOLDER: 'e.g. A',
  GENERATE_FROM: 'From',
  GENERATE_FROM_PLACEHOLDER: '101',
  GENERATE_TO: 'To',
  GENERATE_TO_PLACEHOLDER: '120',
  GENERATE_PREVIEW: (prefix: string, from: number, to: number, count: number) =>
    `${prefix.toUpperCase()}-${String(from)} to ${prefix.toUpperCase()}-${String(to)} (${String(count)} units)`,
  GENERATE_BTN: 'Generate {n} Units',
  GENERATE_GENERATING: 'Generating\u2026',
  GENERATE_SUCCESS: (count: number) => `${String(count)} units generated successfully`,
  // Edit modal
  EDIT_TITLE: 'Edit Unit',
  EDIT_DESCRIPTION: 'Update the unit code.',
  BTN_SAVE: 'Save',
  // Remove
  REMOVE_TITLE: 'Remove Unit',
  REMOVE_DESCRIPTION: (code: string) =>
    `Remove unit ${code}? Any residents linked to this unit will be unassigned.`,
  REMOVE_CONFIRM: 'Remove Unit',
  // Import
  IMPORT_TITLE: 'Import Units from CSV',
  IMPORT_DESCRIPTION: 'Upload a CSV file with one column: code',
  IMPORT_DROP: 'Drop your CSV here or click to browse',
  IMPORT_HINT: 'Only .csv files are supported. One unit code per row.',
  IMPORT_TEMPLATE: 'Download template',
  IMPORT_BUTTON: 'Import {n} Units',
  IMPORT_IMPORTING: 'Importing\u2026',
  // Edit modal
  EDIT_FIELD_CODE: 'New Unit Code',
  EDIT_FIELD_CODE_PLACEHOLDER: 'e.g. A-101',
  EDIT_SUCCESS: 'Unit updated',
  // Detail panel
  DETAIL_SECTION_INFO: 'Details',
  DETAIL_SECTION_RESIDENTS: 'Residents',
  DETAIL_SECTION_ACTIONS: 'Actions',
  DETAIL_NO_RESIDENTS: 'No residents',
  DETAIL_EDIT: 'Edit Unit',
  DETAIL_REMOVE: 'Remove Unit',
  // Pagination
  PAGE_SIZE: 50,
  PAGINATION_SHOWING: (from: number, to: number, total: number) =>
    `Showing ${String(from)}-${String(to)} of ${String(total)}`,
  // Summary
  SUMMARY_ALLOCATED: 'Allocated',
  SUMMARY_TOTAL: 'Added',
  SUMMARY_OCCUPIED: 'Occupied',
  SUMMARY_VACANT: 'Vacant',
  SUMMARY_REMAINING: 'Remaining',
  // Messages
  SUCCESS_ADDED: 'Unit added successfully',
  SUCCESS_UPDATED: 'Unit updated successfully',
  SUCCESS_REMOVED: 'Unit removed successfully',
  SUCCESS_IMPORTED: 'Units imported successfully',
  ERROR_LOAD: 'Failed to load units',
  ERROR_LOAD_DESC: 'Could not retrieve the unit directory.',
  EMPTY_TITLE: 'No units yet',
  EMPTY_DESC: 'Add units so residents can register to your complex.',
  // Status
  STATUS_VACANT: 'Vacant',
  STATUS_OCCUPIED: 'Occupied',
  // Limit enforcement
  LIMIT_BANNER_LOW: (remaining: number, allocated: number) =>
    `${String(remaining)} units remaining out of ${String(allocated)} allocated`,
  LIMIT_BANNER_REACHED: (allocated: number) =>
    `Unit limit reached. All ${String(allocated)} allocated units have been added. Contact your property owner to increase the unit count.`,
  LIMIT_REACHED_TITLE: 'Unit limit reached',
  LIMIT_REACHED_DESC:
    'You cannot add more units. Contact your property owner to increase the allocation.',
  LIMIT_EXCEEDED: (requested: number, remaining: number) =>
    `Cannot generate ${String(requested)} units. Only ${String(remaining)} remaining.`,
  LIMIT_IMPORT_WARNING: (csvCount: number, remaining: number) =>
    `Your CSV has ${String(csvCount)} units but only ${String(remaining)} can be added. The first ${String(remaining)} will be imported, the rest will be skipped.`,
  LIMIT_TOOLTIP: 'Unit limit reached',
} as const

export const UNIT_STATUS_BADGE_CLASSES: Record<string, string> = {
  vacant: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  occupied: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}
