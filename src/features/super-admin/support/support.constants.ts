import type { TicketStatus, TicketPriority } from './support.types'

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

export const TICKET_STATUS_CLASSES: Record<TicketStatus, string> = {
  open: 'bg-blue-100 text-blue-700 border-blue-200',
  in_progress: 'bg-amber-100 text-amber-700 border-amber-200',
  resolved: 'bg-green-100 text-green-700 border-green-200',
  closed: 'bg-slate-100 text-slate-600 border-slate-200',
}

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const TICKET_PRIORITY_CLASSES: Record<TicketPriority, string> = {
  low: 'bg-slate-100 text-slate-600 border-slate-200',
  medium: 'bg-blue-100 text-blue-700 border-blue-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  urgent: 'bg-red-100 text-red-700 border-red-200',
}

export const TICKETS_PAGE_SIZE = 20

export const SUPPORT_COPY = {
  PAGE_TITLE: 'Support',
  PAGE_DESCRIPTION: 'Manage and respond to tenant support tickets',
  ERROR_LOAD: 'Failed to load support tickets',
  EMPTY_TITLE: 'No tickets found',
  EMPTY_DESCRIPTION: 'No support tickets match your current filters.',
  SEARCH_PLACEHOLDER: 'Search tickets…',
  FILTER_ALL_STATUSES: 'All statuses',
  FILTER_ALL_PRIORITIES: 'All priorities',
  COL_SUBJECT: 'Subject',
  COL_PRIORITY: 'Priority',
  COL_STATUS: 'Status',
  COL_SUBMITTER: 'Submitter',
  COL_DATE: 'Date',
  COL_ACTIONS: 'Actions',
  BTN_VIEW: 'View',
  DETAIL_DESCRIPTION: 'Description',
  DETAIL_SUBMITTER: 'Submitter',
  DETAIL_ASSIGNED: 'Assigned to',
  DETAIL_UPDATE_STATUS: 'Update status',
  DETAIL_UNASSIGNED: 'Unassigned',
} as const
