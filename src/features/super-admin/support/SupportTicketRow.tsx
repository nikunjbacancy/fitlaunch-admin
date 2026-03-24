import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import {
  TICKET_STATUS_LABELS,
  TICKET_STATUS_CLASSES,
  TICKET_PRIORITY_LABELS,
  TICKET_PRIORITY_CLASSES,
  SUPPORT_COPY,
} from './support.constants'
import type { SupportTicket } from './support.types'

interface SupportTicketRowProps {
  ticket: SupportTicket
  onSelect: (ticket: SupportTicket) => void
}

export function SupportTicketRow({ ticket, onSelect }: SupportTicketRowProps) {
  return (
    <TableRow className="cursor-pointer hover:bg-muted/50">
      <TableCell>
        <p className="font-medium text-sm">{ticket.subject}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{ticket.tenantName}</p>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={`text-xs ${TICKET_PRIORITY_CLASSES[ticket.priority]}`}>
          {TICKET_PRIORITY_LABELS[ticket.priority]}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={`text-xs ${TICKET_STATUS_CLASSES[ticket.status]}`}>
          {TICKET_STATUS_LABELS[ticket.status]}
        </Badge>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">{ticket.submittedBy}</TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {new Date(ticket.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`${SUPPORT_COPY.BTN_VIEW} ticket: ${ticket.subject}`}
          onClick={() => {
            onSelect(ticket)
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
