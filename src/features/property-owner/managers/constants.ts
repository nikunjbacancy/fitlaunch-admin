export const MANAGERS_COPY = {
  PAGE_TITLE: 'Property Managers',
  PAGE_DESCRIPTION: 'View and manage managers across all your locations',
  // Table
  COL_NAME: 'Name',
  COL_EMAIL: 'Email',
  COL_LOCATION: 'Location',
  COL_STATUS: 'Status',
  COL_ACTIONS: 'Actions',
  // Add manager modal
  ADD_BTN: 'Add Manager',
  MODAL_TITLE: 'Add Property Manager',
  MODAL_DESCRIPTION: 'Assign a new manager to a location. They will receive an email invitation.',
  FIELD_NAME: 'Full Name',
  FIELD_NAME_PLACEHOLDER: 'e.g. Jane Smith',
  FIELD_EMAIL: 'Email Address',
  FIELD_EMAIL_PLACEHOLDER: 'e.g. jane@complex.com',
  FIELD_LOCATION: 'Location',
  FIELD_LOCATION_PLACEHOLDER: 'Select a location',
  BTN_SUBMIT: 'Add Manager',
  BTN_CANCEL: 'Cancel',
  // Remove
  REMOVE_TITLE: 'Remove Manager',
  REMOVE_DESCRIPTION: (name: string, location: string) =>
    `Remove ${name} from ${location}? They will lose admin access to this location.`,
  REMOVE_CONFIRM: 'Remove',
  // Messages
  SUCCESS_ADDED: 'Manager added successfully',
  SUCCESS_REMOVED: 'Manager removed from location',
  ERROR_LOAD: 'Failed to load managers',
  ERROR_LOAD_DESC: 'Could not retrieve manager list.',
  EMPTY_TITLE: 'No managers assigned',
  EMPTY_DESC: 'Add property managers to your locations.',
} as const
