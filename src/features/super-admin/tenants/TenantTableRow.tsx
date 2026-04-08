import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { BadgeStatus } from '@/components/shared/StatusBadge'
import { MoreHorizontal } from 'lucide-react'
import { TENANT_TYPE_LABELS, TENANT_COPY } from './constants'
import { EditComplexModal } from './EditComplexModal'
import { AssignOwnerGroupModal } from './AssignOwnerGroupModal'
import { useResendInvite } from './useTenantActions'
import type { TenantListItem } from './tenant.types'

interface TenantTableRowProps {
  tenant: TenantListItem
}

export function TenantTableRow({ tenant }: TenantTableRowProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [assignOwnerOpen, setAssignOwnerOpen] = useState(false)
  const resendInvite = useResendInvite()

  const isApartment = tenant.tenant_type === 'apartment'
  const primaryUser = tenant.admin_users.at(0)
  const userStatus = primaryUser?.status
  const canResendInvite = isApartment && userStatus === 'invited'
  const createdDate = tenant.created_at ? new Date(tenant.created_at).toLocaleDateString() : '—'

  const initials = (tenant.app_display_name ?? primaryUser?.full_name ?? '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <>
      <TableRow>
        {/* Tenant — logo + name + email */}
        <TableCell>
          <div className="flex items-center gap-3">
            {tenant.logo_url ? (
              <img
                src={tenant.logo_url}
                alt={tenant.app_display_name ?? ''}
                className="h-8 w-8 rounded-md border border-zinc-200 object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-100 text-xs font-semibold text-zinc-600">
                {initials}
              </div>
            )}
            <div>
              <p className="font-medium text-zinc-900">{tenant.app_display_name ?? '—'}</p>
              {primaryUser?.email && <p className="text-xs text-zinc-500">{primaryUser.email}</p>}
            </div>
          </div>
        </TableCell>

        {/* Type */}
        <TableCell>
          {tenant.tenant_type ? (
            <Badge variant="outline" className="text-xs">
              {TENANT_TYPE_LABELS[tenant.tenant_type]}
            </Badge>
          ) : (
            <span className="text-xs text-zinc-400">—</span>
          )}
        </TableCell>

        {/* Status — from admin_users[0].status */}
        <TableCell>
          {userStatus ? (
            <StatusBadge status={userStatus as BadgeStatus} />
          ) : (
            <span className="text-xs text-zinc-400">—</span>
          )}
        </TableCell>

        {/* Created */}
        <TableCell className="text-right text-xs text-zinc-500">{createdDate}</TableCell>

        {/* Actions */}
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Actions for ${tenant.app_display_name ?? 'tenant'}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/super-admin/tenants/${tenant.id}`}>
                  {TENANT_COPY.VIEW_DETAILS_LABEL}
                </Link>
              </DropdownMenuItem>
              {isApartment && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      setEditOpen(true)
                    }}
                  >
                    {TENANT_COPY.EDIT_COMPLEX_LABEL}
                  </DropdownMenuItem>
                </>
              )}
              {isApartment && (
                <DropdownMenuItem
                  onSelect={() => {
                    setAssignOwnerOpen(true)
                  }}
                >
                  {TENANT_COPY.ASSIGN_LOCATION}
                </DropdownMenuItem>
              )}
              {canResendInvite && (
                <DropdownMenuItem
                  onSelect={() => {
                    resendInvite.mutate(tenant.id)
                  }}
                  disabled={resendInvite.isPending}
                >
                  {TENANT_COPY.RESEND_INVITE_LABEL}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {isApartment && (
        <>
          <EditComplexModal open={editOpen} onOpenChange={setEditOpen} tenant={tenant} />
          {assignOwnerOpen && (
            <AssignOwnerGroupModal
              open={assignOwnerOpen}
              onOpenChange={setAssignOwnerOpen}
              tenantId={tenant.id}
              tenantName={tenant.app_display_name ?? ''}
            />
          )}
        </>
      )}
    </>
  )
}
