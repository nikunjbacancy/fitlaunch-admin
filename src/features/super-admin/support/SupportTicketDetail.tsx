import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TICKET_STATUS_LABELS,
  TICKET_STATUS_CLASSES,
  TICKET_PRIORITY_LABELS,
  TICKET_PRIORITY_CLASSES,
  SUPPORT_COPY,
} from './support.constants'
import { useUpdateTicketStatus } from './useSupportTickets'
import type { SupportTicket, TicketStatus } from './support.types'

interface SupportTicketDetailProps {
  ticket: SupportTicket | null
  onClose: () => void
}

export function SupportTicketDetail({ ticket, onClose }: SupportTicketDetailProps) {
  const { mutate: updateStatus, isPending } = useUpdateTicketStatus()

  if (!ticket) return null

  const handleStatusChange = (status: string) => {
    updateStatus({ id: ticket.id, status: status as TicketStatus })
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="pr-6">{ticket.subject}</DialogTitle>
          <DialogDescription>
            Submitted by {ticket.submittedBy} · {new Date(ticket.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={`text-xs ${TICKET_STATUS_CLASSES[ticket.status]}`}>
              {TICKET_STATUS_LABELS[ticket.status]}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs ${TICKET_PRIORITY_CLASSES[ticket.priority]}`}
            >
              {TICKET_PRIORITY_LABELS[ticket.priority]}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {ticket.tenantName}
            </Badge>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              {SUPPORT_COPY.DETAIL_DESCRIPTION}
            </p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          <Separator />

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground">{SUPPORT_COPY.DETAIL_SUBMITTER}</p>
              <p className="font-medium mt-0.5">{ticket.submittedBy}</p>
              <p className="text-muted-foreground">{ticket.submittedByEmail}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{SUPPORT_COPY.DETAIL_ASSIGNED}</p>
              <p className="font-medium mt-0.5">
                {ticket.assignedTo ?? SUPPORT_COPY.DETAIL_UNASSIGNED}
              </p>
            </div>
          </div>

          <Separator />

          {/* Status update */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                {SUPPORT_COPY.DETAIL_UPDATE_STATUS}
              </p>
              <Select value={ticket.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TICKET_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value} className="text-xs">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mt-5" />}
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
