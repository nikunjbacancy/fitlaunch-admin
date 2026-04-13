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
import { TENANT_TYPE_LABELS, TENANT_COPY, PLAN_BADGE_CLASSES, PLAN_LABELS } from './constants'
import { EditComplexModal } from './EditComplexModal'
import { AssignOwnerGroupModal } from './AssignOwnerGroupModal'
import { useResendInvite } from './useTenantActions'
import type { TenantListItem, SubscriptionPlan } from './tenant.types'

type ViewMode = 'apartment' | 'trainer' | 'all'

interface TenantTableRowProps {
  tenant: TenantListItem
  viewMode: ViewMode
}

export function TenantTableRow({ tenant, viewMode }: TenantTableRowProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [assignOwnerOpen, setAssignOwnerOpen] = useState(false)
  const resendInvite = useResendInvite()

  const isApartment = tenant.tenant_type === 'apartment'
  const primaryUser = tenant.admin_users.at(0)
  const canResendInvite = isApartment && primaryUser?.status === 'invited'
  const createdDate = tenant.created_at ? new Date(tenant.created_at).toLocaleDateString() : '—'

  // Derive initials from display name or PM name
  const displayName = tenant.app_display_name ?? primaryUser?.full_name ?? '?'
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  // Status: subscription_status takes priority, fall back to user status
  const status = (tenant.subscription_status ?? primaryUser?.status ?? null) as BadgeStatus | null

  // Plan
  const plan = tenant.subscription_plan as SubscriptionPlan | null
  const planClass = plan ? PLAN_BADGE_CLASSES[plan] || '' : ''
  const planLabel = plan ? PLAN_LABELS[plan] || plan : '—'

  return (
    <>
      <TableRow className="hover:bg-kmvmt-bg/50">
        {/* Tenant */}
        <TableCell>
          <div className="flex items-center gap-3">
            {tenant.logo_url ? (
              <img
                src={tenant.logo_url}
                alt={displayName}
                className="h-9 w-9 rounded-lg border border-zinc-200 object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-kmvmt-navy text-xs font-bold text-white">
                {initials}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-kmvmt-navy">{displayName}</p>
              {primaryUser?.email && (
                <p className="text-xs text-kmvmt-navy/50">{primaryUser.email}</p>
              )}
            </div>
          </div>
        </TableCell>

        {/* Type (all mode only) */}
        {viewMode === 'all' && (
          <TableCell>
            {tenant.tenant_type ? (
              <Badge variant="outline" className="border-zinc-200 text-xs text-kmvmt-navy/70">
                {TENANT_TYPE_LABELS[tenant.tenant_type]}
              </Badge>
            ) : (
              <span className="text-xs text-kmvmt-navy/30">—</span>
            )}
          </TableCell>
        )}

        {/* Plan */}
        <TableCell>
          {plan ? (
            <Badge variant="outline" className={`text-xs ${planClass}`}>
              {planLabel}
            </Badge>
          ) : (
            <span className="text-xs text-kmvmt-navy/30">—</span>
          )}
        </TableCell>

        {/* Status */}
        <TableCell>
          {status ? (
            <StatusBadge status={status} />
          ) : (
            <span className="text-xs text-kmvmt-navy/30">—</span>
          )}
        </TableCell>

        {/* Units / Price (apartment mode only) */}
        {viewMode === 'apartment' && (
          <TableCell>
            {tenant.unit_count != null ? (
              <div>
                <p className="text-sm font-medium text-kmvmt-navy">
                  {tenant.unit_count.toLocaleString()} units
                </p>
                {tenant.price_per_unit != null && (
                  <p className="text-xs text-kmvmt-navy/50">
                    ${tenant.price_per_unit.toFixed(2)} / unit
                  </p>
                )}
              </div>
            ) : (
              <span className="text-xs text-kmvmt-navy/30">—</span>
            )}
          </TableCell>
        )}

        {/* Created */}
        <TableCell className="text-right text-xs text-kmvmt-navy/50">{createdDate}</TableCell>

        {/* Actions */}
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-kmvmt-navy/40 hover:text-kmvmt-navy"
                aria-label={`Actions for ${displayName}`}
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
                  <DropdownMenuItem
                    onSelect={() => {
                      setAssignOwnerOpen(true)
                    }}
                  >
                    {TENANT_COPY.ASSIGN_LOCATION}
                  </DropdownMenuItem>
                </>
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
