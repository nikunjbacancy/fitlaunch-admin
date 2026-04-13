import type { ResidentStatus } from './resident.types'

export const RESIDENT_STATUS_LABELS: Record<ResidentStatus, string> = {
  active: 'Active',
  pending: 'Pending',
  suspended: 'Suspended',
  removed: 'Removed',
}

export const RESIDENT_STATUS_CLASSES: Record<ResidentStatus, string> = {
  active: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  suspended: 'bg-red-100 text-red-700 border-red-200',
  removed: 'bg-slate-100 text-slate-600 border-slate-200',
}

export const RESIDENTS_PAGE_SIZE = 50

export const RESIDENT_COPY = {
  PAGE_TITLE: 'Residents',
  PAGE_DESCRIPTION: 'Manage resident access and approvals for your community',
  ERROR_LOAD: 'Failed to load residents',
  EMPTY_TITLE: 'No residents yet',
  EMPTY_DESCRIPTION:
    'Residents will appear here as they register through the mobile app using your unit codes.',
  EMPTY_FILTERED_TITLE: 'No residents match your filters',
  EMPTY_FILTERED_DESCRIPTION: 'Try clearing filters or adjusting your search.',
  SEARCH_PLACEHOLDER: 'Search residents…',
  FILTER_ALL_STATUSES: 'All statuses',
  COL_RESIDENT: 'Resident',
  COL_UNIT: 'Unit',
  COL_STATUS: 'Status',
  COL_JOINED: 'Joined',
  COL_LAST_ACTIVE: 'Last Active',
  COL_ACTIONS: 'Actions',
  ARIA_PREV_PAGE: 'Previous page',
  ARIA_NEXT_PAGE: 'Next page',
  ARIA_REMOVE: 'Remove resident',
  BULK_APPROVE_LABEL: 'Approve selected',
  BULK_CLEAR_LABEL: 'Clear selection',
  REMOVE_DIALOG_TITLE: 'Remove resident?',
  REMOVE_DIALOG_DESC:
    'This will permanently remove this resident and revoke their platform access. This action cannot be undone.',
  REMOVE_CONFIRM_LABEL: 'Remove',
  CANCEL_LABEL: 'Cancel',
} as const
