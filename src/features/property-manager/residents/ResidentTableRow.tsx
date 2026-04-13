import { Trash2 } from 'lucide-react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RESIDENT_STATUS_LABELS, RESIDENT_STATUS_CLASSES, RESIDENT_COPY } from './constants'
import { cn } from '@/lib/utils'
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
    <TableRow
      className={cn(
        'border-0 transition-colors hover:bg-kmvmt-bg/40',
        isSelected && 'bg-kmvmt-navy/5 hover:bg-kmvmt-navy/5'
      )}
    >
      <TableCell className="py-5 pl-8">
        <Checkbox
          checked={isSelected}
          aria-label={`Select ${resident.fullName}`}
          onCheckedChange={(checked) => {
            onSelect(resident.id, checked === true)
          }}
        />
      </TableCell>
      <TableCell className="py-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-kmvmt-bg">
            <AvatarImage src={resident.avatarUrl ?? undefined} alt={resident.fullName} />
            <AvatarFallback className="bg-kmvmt-navy/10 text-[11px] font-bold text-kmvmt-navy">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-kmvmt-navy">{resident.fullName}</p>
            <p className="truncate text-[11px] text-kmvmt-navy/40">{resident.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-5 text-sm font-semibold text-kmvmt-navy">
        {resident.unitCode}
      </TableCell>
      <TableCell className="py-5">
        <Badge
          variant="outline"
          className={`rounded-full text-[10px] font-bold uppercase tracking-wider ${RESIDENT_STATUS_CLASSES[resident.status]}`}
        >
          {RESIDENT_STATUS_LABELS[resident.status]}
        </Badge>
      </TableCell>
      <TableCell className="py-5 text-xs text-kmvmt-navy/50">
        {new Date(resident.joinedAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="py-5 text-xs text-kmvmt-navy/50">
        {resident.lastActiveAt ? new Date(resident.lastActiveAt).toLocaleDateString() : '—'}
      </TableCell>
      <TableCell className="py-5 pr-8 text-right">
        <button
          type="button"
          aria-label={`${RESIDENT_COPY.ARIA_REMOVE} ${resident.fullName}`}
          onClick={() => {
            onRemove(resident)
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-kmvmt-navy/40 transition-colors hover:bg-kmvmt-red-light/10 hover:text-kmvmt-red-dark"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </TableCell>
    </TableRow>
  )
}
