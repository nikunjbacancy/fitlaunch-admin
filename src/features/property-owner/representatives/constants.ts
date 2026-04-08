export const REPRESENTATIVES_COPY = {
  PAGE_TITLE: 'Representatives',
  PAGE_DESCRIPTION: 'Manage people who have access to your ownership dashboard',
  INVITE_BTN: 'Invite Representative',
  // Table
  COL_NAME: 'Name',
  COL_EMAIL: 'Email',
  COL_STATUS: 'Status',
  COL_JOINED: 'Joined',
  COL_ACTIONS: 'Actions',
  // Invite modal
  MODAL_TITLE: 'Invite Representative',
  MODAL_DESCRIPTION:
    'They will receive an email invitation and get full access to all locations and billing.',
  FIELD_NAME: 'Full Name',
  FIELD_NAME_PLACEHOLDER: 'e.g. John Smith',
  FIELD_EMAIL: 'Email Address',
  FIELD_EMAIL_PLACEHOLDER: 'e.g. john@company.com',
  BTN_SEND_INVITE: 'Send Invitation',
  BTN_CANCEL: 'Cancel',
  // Remove
  REMOVE_TITLE: 'Remove Representative',
  REMOVE_DESCRIPTION: (name: string) =>
    `Are you sure you want to remove ${name}? They will lose access to the owner dashboard immediately.`,
  REMOVE_CONFIRM: 'Remove Access',
  // Messages
  SUCCESS_INVITED: 'Invitation sent successfully',
  SUCCESS_REMOVED: 'Representative removed',
  ERROR_LOAD: 'Failed to load representatives',
  ERROR_LOAD_DESC: 'Could not retrieve your representatives.',
  EMPTY_TITLE: 'No other representatives',
  EMPTY_DESC: 'Invite team members to share access to your ownership dashboard.',
} as const
