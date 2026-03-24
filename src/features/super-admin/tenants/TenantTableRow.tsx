import { Link } from 'react-router-dom'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { BadgeStatus } from '@/components/shared/StatusBadge'
import { ChevronRight } from 'lucide-react'
import { PLAN_LABELS, TENANT_TYPE_LABELS, PLAN_BADGE_CLASSES } from './constants'
import type { TenantListItem } from './tenant.types'

interface TenantTableRowProps {
  tenant: TenantListItem
}

export function TenantTableRow({ tenant }: TenantTableRowProps) {
  const planClass = PLAN_BADGE_CLASSES[tenant.plan] ?? PLAN_BADGE_CLASSES.starter

  return (
    <TableRow>
      <TableCell>
        <div>
          <p className="font-medium text-foreground">{tenant.name}</p>
          <p className="text-xs text-muted-foreground">{tenant.ownerEmail}</p>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {TENANT_TYPE_LABELS[tenant.tenantType]}
        </Badge>
      </TableCell>
      <TableCell>
        <StatusBadge status={tenant.status as BadgeStatus} />
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={planClass}>
          {PLAN_LABELS[tenant.plan]}
        </Badge>
      </TableCell>
      <TableCell className="text-right tabular-nums">{tenant.memberCount}</TableCell>
      <TableCell className="text-right tabular-nums">${tenant.mrr.toLocaleString()}</TableCell>
      <TableCell className="text-right text-xs text-muted-foreground">
        {new Date(tenant.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/super-admin/tenants/${tenant.id}`} aria-label={`View ${tenant.name}`}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  )
}
