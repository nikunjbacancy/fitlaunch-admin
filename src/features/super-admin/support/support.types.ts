export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface SupportTicket {
  id: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  tenantId: string
  tenantName: string
  submittedBy: string
  submittedByEmail: string
  assignedTo: string | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
}

export interface TicketFilters {
  status?: TicketStatus
  priority?: TicketPriority
  search?: string
}
