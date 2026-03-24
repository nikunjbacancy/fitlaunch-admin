import { Trash2 } from 'lucide-react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RESIDENT_STATUS_LABELS, RESIDENT_STATUS_CLASSES } from './constants'
import type { Resident } from './resident.types'

interface ResidentTableRowProps {
  resident: Resident
  isSelected: boolean
  onSelect: (id: string, checked: boolean) => void
  onRemove: (resident: Resident) => void
}

export function ResidentTableRow({
  resident,
  isSelected,
  onSelect,
  onRemove,
}: ResidentTableRowProps) {
  const initials = resident.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <TableRow className={isSelected ? 'bg-blue-50/50' : undefined}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          aria-label={`Select ${resident.fullName}`}
          onCheckedChange={(checked) => {
            onSelect(resident.id, checked === true)
          }}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={resident.avatarUrl ?? undefined} alt={resident.fullName} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{resident.fullName}</p>
            <p className="text-xs text-muted-foreground">{resident.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm">{resident.unitNumber}</TableCell>
      <TableCell>
        <Badge variant="outline" className={`text-xs ${RESIDENT_STATUS_CLASSES[resident.status]}`}>
          {RESIDENT_STATUS_LABELS[resident.status]}
        </Badge>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {new Date(resident.joinedAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {resident.lastActiveAt ? new Date(resident.lastActiveAt).toLocaleDateString() : '—'}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Remove ${resident.fullName}`}
          className="text-destructive hover:text-destructive"
          onClick={() => {
            onRemove(resident)
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
