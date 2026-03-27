import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type BadgeStatus =
  | 'active'
  | 'inactive'
  | 'invited'
  | 'suspended'
  | 'trial'
  | 'lapsed'
  | 'pending'
  | 'pending_invite'
  | 'occupied'
  | 'vacant'
  | 'open'
  | 'resolved'

const STATUS_CONFIG: Record<BadgeStatus, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  invited: {
    label: 'Invite Sent',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  suspended: {
    label: 'Suspended',
    className: 'bg-kmvmt-burgundy/10 text-kmvmt-burgundy border-kmvmt-burgundy/30',
  },
  trial: {
    label: 'Trial',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  lapsed: {
    label: 'Lapsed',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  pending_invite: {
    label: 'Invite Sent',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  occupied: {
    label: 'Occupied',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  vacant: {
    label: 'Vacant',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  open: {
    label: 'Open',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
}

interface StatusBadgeProps {
  status: BadgeStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
